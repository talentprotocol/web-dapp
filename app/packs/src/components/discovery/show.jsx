import React, { useEffect, useState, useContext, useMemo } from "react";
import { ArrowLeft, Help } from "src/components/icons";
import Tooltip from "src/components/design_system/tooltip";

import { useWindowDimensionsHook } from "src/utils/window";

import {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO,
  client,
} from "src/utils/thegraph";
import {
  getSupporterCount,
  getMarketCap,
  getProgress,
} from "src/utils/viewHelpers";
import {
  compareName,
  compareOccupation,
  compareSupporters,
  compareMarketCap,
} from "src/components/talent/utils/talent";
import { post, destroy } from "src/utils/requests";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

import { H3, P1, P2 } from "src/components/design_system/typography";
import TalentTableListMode from "src/components/talent/TalentTableListMode";
import TalentTableCardMode from "src/components/talent/TalentTableCardMode";
import TalentOptions from "src/components/talent/TalentOptions";

import cx from "classnames";

const DiscoveryShow = ({ discoveryRow, talents }) => {
  const theme = useContext(ThemeContext);
  const { mobile } = useWindowDimensionsHook();
  const [localTalents, setLocalTalents] = useState(talents);
  const { loading, data } = useQuery(GET_TALENT_PORTFOLIO, {
    variables: {
      ids: localTalents
        .map((talent) => talent.token.contractId)
        .filter((id) => id),
    },
  });
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [listModeOnly, setListModeOnly] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const updateFollow = async (talent) => {
    const newLocalTalents = localTalents.map((currTalent) => {
      if (currTalent.id === talent.id) {
        return { ...currTalent, isFollowing: !talent.isFollowing };
      } else {
        return { ...currTalent };
      }
    });

    if (talent.isFollowing) {
      const response = await destroy(
        `/api/v1/follows?user_id=${talent.userId}`
      );

      if (response.success) {
        setLocalTalents([...newLocalTalents]);
      }
    } else {
      const response = await post(`/api/v1/follows`, {
        user_id: talent.userId,
      });

      if (response.success) {
        setLocalTalents([...newLocalTalents]);
      }
    }
  };

  const filteredTalents = useMemo(() => {
    let desiredTalent = [...localTalents];

    let comparisonFunction;

    switch (selectedSort) {
      case "Supporters":
        comparisonFunction = compareSupporters;
        break;
      case "Occupation":
        comparisonFunction = compareOccupation;
        break;
      case "Market Cap":
        comparisonFunction = compareMarketCap;
        break;
      case "Alphabetical Order":
        comparisonFunction = compareName;
        break;
    }

    if (sortDirection === "asc") {
      desiredTalent.sort(comparisonFunction).reverse();
    } else if (sortDirection === "desc") {
      desiredTalent.sort(comparisonFunction);
    }

    return desiredTalent;
  }, [localTalents, watchlistOnly, selectedSort, sortDirection, data]);

  useEffect(() => {
    if (loading || !data?.talentTokens) {
      return;
    }

    const newTalents = data.talentTokens.map(
      ({ id, totalSupply, maxSupply, supporterCounter, ...rest }) => ({
        ...rest,
        token: { contractId: id },
        progress: getProgress(totalSupply, maxSupply),
        marketCap: getMarketCap(totalSupply),
        supporterCounter: getSupporterCount(supporterCounter),
      })
    );

    setLocalTalents((prev) =>
      Object.values(
        [...prev, ...newTalents].reduce(
          (result, { id, token, marketCap, supporterCounter, ...rest }) => {
            result[token.contractId || id] = {
              ...(result[token.contractId || id] || {}),
              id: result[token.contractId || id]?.id || id,
              token: { ...result[token.contractId]?.token, ...token },
              marketCap: marketCap || "-1",
              supporterCounter: supporterCounter || "-1",
              ...rest,
            };

            return result;
          },
          {}
        )
      )
    );
  }, [data, loading]);

  return (
    <div className={cx(mobile && "p-4")}>
      <div className="talent-list-header  d-flex flex-column justify-content-center">
        <a className="button-link mb-5" href="/">
          <ArrowLeft
            color={theme.mode() == "light" ? "black" : "white"}
            size={16}
          />
        </a>
        <div className="d-flex align-items-center mb-3">
          <H3 className="text-black mr-2" bold text={discoveryRow.title} />
          {discoveryRow.tags && (
            <Tooltip
              body={discoveryRow.tags}
              popOverAccessibilityId={"discovery_row_tags"}
              placement="top"
            >
              <div className="cursor-pointer d-flex align-items-center">
                <Help color="#536471" />
              </div>
            </Tooltip>
          )}
        </div>
        {discoveryRow.description && (
          <P1
            className="text-primary-03 mb-3"
            text={discoveryRow.description}
          />
        )}
        <div className="d-flex">
          <P1
            bold
            className="text-black d-inline mr-2"
            text={discoveryRow.talentsCount}
          />
          <P1 className="text-primary-03 d-inline" text="talents" />
        </div>
      </div>
      <TalentOptions
        headerDescription={`${discoveryRow.title} Talent List`}
        listModeOnly={listModeOnly}
        searchUrl={`/discovery/${discoveryRow.slug}`}
        setListModeOnly={setListModeOnly}
        setLocalTalents={setLocalTalents}
        setSelectedSort={setSelectedSort}
        setSortDirection={setSortDirection}
      />
      {localTalents.length === 0 && (
        <div className="d-flex justify-content-center mt-6">
          <P2
            className="text-black"
            bold
            text="We couldn't find any talent based on your search."
          />
        </div>
      )}
      {listModeOnly ? (
        <TalentTableListMode
          theme={theme}
          talents={filteredTalents}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          showFirstBoughtField={false}
          updateFollow={updateFollow}
        />
      ) : (
        <TalentTableCardMode
          talents={filteredTalents}
          updateFollow={updateFollow}
        />
      )}
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer {...props}>
      <ApolloProvider client={client(railsContext.contractsEnv)}>
        <DiscoveryShow {...props} />
      </ApolloProvider>
    </ThemeContainer>
  );
};
