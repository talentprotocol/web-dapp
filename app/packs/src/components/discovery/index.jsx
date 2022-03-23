import React, { useEffect, useMemo, useState, useCallback } from "react";

import { post, destroy } from "src/utils/requests";
import { useWindowDimensionsHook } from "src/utils/window";
import { ethers } from "ethers";
import { parseAndCommify } from "src/onchain/utils";
import {
  ApolloProvider,
  useQuery,
  GET_DISCOVERY_TALENTS,
  client,
} from "src/utils/thegraph";

import { COMMUNITY_S01_NFT_AIRDROP } from "src/utils/constants";
import { H3, P1, Caption } from "src/components/design_system/typography";
import { Spinner } from "src/components/icons";
import HighlightsCard from "src/components/design_system/highlights_card";
import Button from "src/components/design_system/button";

import DiscoveryRows from "./discovery_rows";
import DiscoveryMarketingArticles from "./discovery_marketing_articles";

import cx from "classnames";

const Discovery = ({ discoveryRows, marketingArticles }) => {
  const { mobile } = useWindowDimensionsHook();
  const [localDiscoveryRows, setLocalDiscoveryRows] = useState(discoveryRows);
  const [loading, setLoading] = useState(true);

  const talentIdsPerRow = useMemo(
    () =>
      discoveryRows.reduce((acc, curr) => {
        if (curr.talents.length > 0) {
          return { ...acc, [curr.title]: curr.talents.map((t) => t.id) };
        }
        return { ...acc };
      }, {}),
    [discoveryRows]
  );

  const addTokenDetails = useCallback((talents, talentsFromChain) => {
    const newArray = talents.map((talent) => {
      const talentFromChain = talentsFromChain.find(
        (t) => t.id === talent.contractId
      );
      if (talentFromChain) {
        const totalSupply = ethers.utils.formatUnits(
          talentFromChain.totalSupply || 0
        );
        const supporterCount = talentFromChain.supporterCounter;

        return {
          ...talent,
          marketCap: parseAndCommify(totalSupply * 0.1),
          supporterCount: supporterCount,
        };
      } else {
        return { ...talent };
      }
    });

    return newArray;
  }, []);

  const setLocalData = (data) => {
    if (data.talents) {
      setLocalDiscoveryRows((prev) => {
        const newArray = prev.map((row) => ({
          ...row,
          talents: addTokenDetails(row.talents, data.talents),
        }));

        return newArray;
      });
    }
  };

  useQuery(GET_DISCOVERY_TALENTS, {
    variables: {
      talentIds: localDiscoveryRows
        .map((row) => row.talents)
        .flat()
        .map((talent) => talent.contractId)
        .filter((id) => id),
    },
    onCompleted: setLocalData,
  });

  const updateFollow = async (talent) => {
    const newDiscoveryRows = localDiscoveryRows.map((currRow) => {
      const rowTalents = currRow.talents.map((currTalent) => {
        if (currTalent.id === talent.id) {
          return { ...currTalent, isFollowing: !talent.isFollowing };
        } else {
          return { ...currTalent };
        }
      });
      return { ...currRow, talents: rowTalents };
    });

    if (talent.isFollowing) {
      const response = await destroy(
        `/api/v1/follows?user_id=${talent.userId}`
      );

      if (response.success) {
        setLocalDiscoveryRows([...newDiscoveryRows]);
      }
    } else {
      const response = await post(`/api/v1/follows`, {
        user_id: talent.userId,
      });

      if (response.success) {
        setLocalDiscoveryRows([...newDiscoveryRows]);
      }
    }
  };

  useEffect(() => {
    let idsInUse = [];
    let newOrderOfTalents = {};

    // the goal is to find in each row 4 talent that aren't already picked
    Object.entries(talentIdsPerRow).forEach((ids) => {
      const difference = ids[1].filter((x) => !idsInUse.includes(x));
      const intersection = ids[1].filter((x) => idsInUse.includes(x));
      // difference is the array with the values that are different
      // intersection has the duplicates
      // so now we just pick the first 4 and move it to the front

      // add the difference before the intersection
      newOrderOfTalents = {
        ...newOrderOfTalents,
        [ids[0]]: [...difference, ...intersection],
      };

      idsInUse = [...idsInUse, ...newOrderOfTalents[ids[0]].slice(0, 4)];
    });

    const newRows = localDiscoveryRows.map((row) => {
      return {
        ...row,
        talents: row.talents.sort(
          (talent1, talent2) =>
            newOrderOfTalents[row.title].indexOf(talent1.id) -
            newOrderOfTalents[row.title].indexOf(talent2.id)
        ),
      };
    });

    setLocalDiscoveryRows([...newRows]);
    setLoading(false);
  }, []);

  return (
    <div className="d-flex flex-column">
      {!mobile && (
        <div className="talent-background">
          <div className="talent-background-text permanent-text-white">
            <div className="col-1"></div>
            <div style={{ width: "420px" }}>
              <Caption
                className="mb-2 text-yellow"
                text="NFT AIRDROP - SEASON 1"
                bold
              />
              <H3
                className="pb-4"
                text="Community contributors just earned a special NFT!"
                bold
              />
              <Button
                type="dark-mode-static-white-default"
                size="extra-big"
                onClick={() => window.open(COMMUNITY_S01_NFT_AIRDROP, "_blank")}
              >
                <P1 className="text-primary" bold text="Learn More" />
              </Button>
            </div>
          </div>
        </div>
      )}
      <div
        className={cx(
          "w-100 d-flex flex-wrap mt-6 mb-6",
          mobile ? "justify-content-center" : "justify-content-between"
        )}
      >
        <HighlightsCard
          className="mt-2"
          title="Trending"
          link="/talent?status=Trending"
        />
        <HighlightsCard
          className="mt-2"
          title="Latest Added"
          link="/talent?status=Latest+added"
        />
        <HighlightsCard
          className="mt-2"
          title="Launching Soon"
          link="/talent?status=Launching+soon"
        />
      </div>
      {loading ? (
        <div className="w-100 d-flex flex-row my-2 justify-content-center">
          <Spinner />
        </div>
      ) : (
        <DiscoveryRows
          discoveryRows={localDiscoveryRows}
          updateFollow={updateFollow}
        />
      )}
      {marketingArticles.length > 0 && (
        <div className="mt-3 mb-4">
          <DiscoveryMarketingArticles marketingArticles={marketingArticles} />
        </div>
      )}
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ApolloProvider client={client(railsContext.contractsEnv)}>
      <Discovery {...props} railsContext={railsContext} />
    </ApolloProvider>
  );
};
