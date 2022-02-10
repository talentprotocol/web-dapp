import React, { useState } from "react";

import { post, destroy } from "src/utils/requests";
import { useWindowDimensionsHook } from "../../utils/window";
import { H2, P1 } from "src/components/design_system/typography";
import HighlightsCard from "src/components/design_system/highlights_card";
import NewTalentCard from "src/components/design_system/cards/NewTalentCard";
import MarketingCard from "src/components/design_system/cards/MarketingCard";

import cx from "classnames";

const Discovery = ({
  mostTrendyTalents,
  latestAddedTalents,
  launchingSoonTalents,
  discoveryRows,
  marketingArticles,
  railsContext,
}) => {
  const { mobile } = useWindowDimensionsHook();
  const [localDiscoveryRows, setLocalDiscoveryRows] = useState(discoveryRows);

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
      <div className="w-100 d-flex flex-wrap justify-content-between mt-6">
        <HighlightsCard
          className="mt-2"
          title="Most Trendy"
          talents={mostTrendyTalents}
          railsContext={railsContext}
        />
        <HighlightsCard
          className="mt-2"
          title="Latest Added"
          talents={latestAddedTalents}
          railsContext={railsContext}
        />
        <HighlightsCard
          className="mt-2"
          title="Launching Soon"
          talents={launchingSoonTalents}
          railsContext={railsContext}
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
                    contractId={talent.contractId}
                    headline={talent.headline}
                    isFollowing={talent.isFollowing}
                    updateFollow={() => updateFollow(talent)}
                    talentLink={`/talent/${talent.username}`}
                    railsContext={railsContext}
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
        <div className="d-flex justify-content-between flex-wrap mb-4">
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
  return () => <Discovery {...props} railsContext={railsContext} />;
};
