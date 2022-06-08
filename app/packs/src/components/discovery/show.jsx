import React, { useEffect, useState, useContext, useMemo } from "react";
import { ArrowLeft, Help } from "src/components/icons";
import Tooltip from "src/components/design_system/tooltip";
import Button from "src/components/design_system/button";
import { ethers } from "ethers";

import { faGlobeEurope } from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  getStartDateForVariance,
  getUTCDate,
  getMarketCapVariance,
} from "src/utils/viewHelpers";
import {
  compareName,
  compareOccupation,
  compareSupporters,
  compareMarketCap,
  compareMarketCapVariance,
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

  const startDate = getStartDateForVariance();
  const { loading, data } = useQuery(GET_TALENT_PORTFOLIO, {
    variables: {
      ids: localTalents
        .map((talent) => talent.token.contractId)
        .filter((id) => id),
      startDate,
    },
  });
  const [listModeOnly, setListModeOnly] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const partnership = discoveryRow.partnership;
  const partnershipSocialLinks =
    partnership && (partnership.website_url || partnership.twitter_url);

  const totalSupplyToString = (totalSupply) => {
    const bignumber = ethers.BigNumber.from(totalSupply).div(10);
    return ethers.utils.commify(ethers.utils.formatUnits(bignumber));
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
      case "Market Cap Variance":
        comparisonFunction = compareMarketCapVariance;
        break;
    }

    if (sortDirection === "asc") {
      desiredTalent.sort(comparisonFunction).reverse();
    } else if (sortDirection === "desc") {
      desiredTalent.sort(comparisonFunction);
    }

    return desiredTalent;
  }, [localTalents, selectedSort, sortDirection, data]);

  useEffect(() => {
    if (loading || !data?.talentTokens) {
      return;
    }

    const newTalents = data.talentTokens.map(
      ({
        id,
        totalSupply,
        maxSupply,
        supporterCounter,
        tokenDayData,
        createdAtTimestamp,
        ...rest
      }) => {
        let deployDateUTC;
        if (!!createdAtTimestamp) {
          const msDividend = 1000;
          deployDateUTC = getUTCDate(parseInt(createdAtTimestamp) * msDividend);
        } else {
          const localTalent = localTalents.find(
            (talent) => talent.token.contractId == talent.id
          );
          deployDateUTC =
            localTalent && getUTCDate(localTalent.token.deployedAt);
        }

        return {
          ...rest,
          token: { contractId: id },
          progress: getProgress(totalSupply, maxSupply),
          marketCap: getMarketCap(totalSupply),
          supporterCounter: getSupporterCount(supporterCounter),
          marketCapVariance: getMarketCapVariance(
            tokenDayData || [],
            deployDateUTC || 0,
            startDate,
            totalSupply
          ),
        };
      }
    );

    setLocalTalents((prev) =>
      Object.values(
        [...prev, ...newTalents].reduce(
          (
            result,
            {
              id,
              token,
              marketCap,
              supporterCounter,
              marketCapVariance,
              ...rest
            }
          ) => {
            result[token.contractId || id] = {
              ...(result[token.contractId || id] || {}),
              id: result[token.contractId || id]?.id || id,
              token: { ...result[token.contractId]?.token, ...token },
              marketCap: marketCap || "-1",
              supporterCounter: supporterCounter || "-1",
              marketCapVariance: marketCapVariance || "0%",
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
      <div
        className={cx(
          "talent-list-header d-flex flex-column justify-content-center",
          partnership && "partnership"
        )}
      >
        <a className="button-link mb-5" href="/">
          <Button
            onClick={() => null}
            type="white-ghost"
            size="icon"
            className="d-flex align-items-center justify-content-center"
          >
            <ArrowLeft color="currentColor" size={16} />
          </Button>
        </a>
        {partnership && partnership.logo_url && (
          <img
            className="rounded-circle image-fit mb-4"
            src={partnership.logo_url}
            width={"72px"}
            alt="Partnership Picture"
          />
        )}
        <div className="d-flex align-items-center">
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
            className="text-primary-03 mb-4"
            text={discoveryRow.description}
          />
        )}

        {partnershipSocialLinks && (
          <div className="d-flex flex-row flex-wrap text-primary-03 mb-4">
            {partnership.website_url && (
              <a
                href={partnership.website_url}
                target="self"
                className="mr-4 text-reset hover-primary"
              >
                <FontAwesomeIcon icon={faGlobeEurope} />
              </a>
            )}
            {partnership.twitter_url && (
              <a
                href={partnership.twitter_url}
                target="self"
                className="mr-4 text-reset hover-primary"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            )}
          </div>
        )}
        <div className="d-flex">
          <P1
            bold
            className="text-black d-inline mr-2"
            text={`$${totalSupplyToString(discoveryRow.talentsTotalSupply)}`}
          />
          <P1
            className="text-primary-03 mr-4 d-inline"
            text={`${discoveryRow.title} Market Cap`}
          />
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
