import React, { useEffect, useState, useContext, useMemo } from "react";
import { ethers } from "ethers";

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

const DiscoveryShow = ({ discoveryRow, talents, userLoggedIn }) => {
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

  const changeTab = (tab) => {
    setWatchlistOnly(tab === "Watchlist" ? true : false);
  };

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
    <div className={cx("pb-6", mobile && "p-4")}>
      <div className="mb-5">
        <H3
          className="text-black mb-3"
          bold
          text={`${discoveryRow.title} Discovery Row`}
        />
        <P1
          className="text-primary-03"
          text="Support undiscovered talent and be rewarded as they grow."
        />
      </div>
      <TalentOptions
        changeTab={changeTab}
        listModeOnly={listModeOnly}
        searchUrl={`/discovery/${discoveryRow.slug}`}
        setListModeOnly={setListModeOnly}
        setLocalTalents={setLocalTalents}
        setSelectedSort={setSelectedSort}
        setSortDirection={setSortDirection}
        userLoggedIn={userLoggedIn}
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
