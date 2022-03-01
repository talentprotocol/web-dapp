import React from "react";
import { useWindowDimensionsHook } from "src/utils/window";
import { P1 } from "src/components/design_system/typography";
import MarketingCard from "src/components/design_system/cards/MarketingCard";

import cx from "classnames";

const DiscoveryMarketingArticles = ({ marketingArticles }) => {
  const { mobile } = useWindowDimensionsHook();

  return (
    <>
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
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default DiscoveryMarketingArticles;
