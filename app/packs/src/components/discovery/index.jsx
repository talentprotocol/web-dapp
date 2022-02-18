import React, { useState, useCallback, useEffect } from "react";

import { get, post, destroy } from "src/utils/requests";
import { useWindowDimensionsHook } from "../../utils/window";
import { ethers } from "ethers";
import { parseAndCommify } from "src/onchain/utils";
import {
  ApolloProvider,
  useQuery,
  GET_DISCOVERY_TALENTS,
  client,
} from "src/utils/thegraph";

import { H2, P1 } from "src/components/design_system/typography";
import HighlightsCard from "src/components/design_system/highlights_card";
import NewTalentCard from "src/components/design_system/cards/NewTalentCard";
import MarketingCard from "src/components/design_system/cards/MarketingCard";

import cx from "classnames";

const Discovery = ({ discoveryRows, marketingArticles }) => {
  const { mobile } = useWindowDimensionsHook();
  const [localDiscoveryRows, setLocalDiscoveryRows] = useState(discoveryRows);

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

  return (
    <div className="d-flex flex-column">
      {!mobile && (
        <div className="talent-background">
          <div className="talent-background-text text-white">
            <H2 className="d-inline" text="Support" bold />
            <H2
              className="d-inline text-yellow ml-2"
              text="undiscovered"
              bold
            />
            <H2 className="d-inline text-yellow" text="talent" bold />
            <H2 className="d-inline ml-2" text="and be rewarded as" bold />
            <H2 className="d-inline" text="they" bold />
            <H2 className="d-inline text-yellow ml-2" text=" grow." bold />
          </div>
        </div>
      )}
      <div
        className={cx(
          "w-100 d-flex flex-wrap mt-6",
          mobile ? "justify-content-center" : "justify-content-between"
        )}
      >
        <HighlightsCard
          className="mt-2"
          title="Most Trendy"
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
      <div>
        {localDiscoveryRows.map((row) => (
          <div key={row.title} className="mt-6">
            <P1
              bold
              text={row.title}
              className={cx("text-black", mobile && "ml-4")}
            />
            <div
              className={cx(
                "w-100 d-flex flex-wrap",
                mobile ? "justify-content-center" : "justify-content-between"
              )}
            >
              {row.talents.map((talent) => (
                <div key={talent.id} className="mt-3">
                  <NewTalentCard
                    name={talent.name}
                    ticker={talent.ticker}
                    occupation={talent.occupation}
                    profilePictureUrl={talent.profilePictureUrl}
                    headline={talent.headline}
                    isFollowing={talent.isFollowing}
                    updateFollow={() => updateFollow(talent)}
                    talentLink={`/talent/${talent.username}`}
                    marketCap={talent.marketCap}
                    supporterCount={talent.supporterCount}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 mb-4">
        <P1
          className={cx("text-black", mobile && "ml-4")}
          bold
          text="More from Talent Protocol"
        />
        <div
          className={cx(
            "d-flex flex-wrap mb-4",
            mobile ? "justify-content-center" : "justify-content-between"
          )}
        >
          {marketingArticles.map((article) => (
            <div key={article.id} className="mt-3">
              <MarketingCard
                link={article.link}
                title={article.title}
                imgUrl={article.imgUrl}
                description={article.description}
                user={article.user}
                date={article.date}
              />
            </div>
          ))}
        </div>
      </div>
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
