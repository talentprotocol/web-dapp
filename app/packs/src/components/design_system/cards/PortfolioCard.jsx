import React from "react";
import Caption from "src/components/design_system/typography/caption";
import H3 from "src/components/design_system/typography/h3";
import H5 from "src/components/design_system/typography/h5";

const PortfolioCard = ({ mode, title, subtitle, description }) => {
  return (
    <div className={`col-md-3 card ${mode}`}>
      {title ? (
        <Caption
          className="portfolio-card-title text-uppercase"
          mode={`${mode}`}
          text={`${mode}`}
        ></Caption>
      ) : null}

      {subtitle ? (
        <H3
          className="portfolio-card-line-subtitle"
          mode={`${mode}`}
          bold="true"
          text={`${subtitle}`}
        >
          {" "}
        </H3>
      ) : null}

      {description ? (
        <H5
          className="portfolio-card-line-description"
          text={`${description} `}
        >
          {" "}
        </H5>
      ) : null}
    </div>
  );
};

export default PortfolioCard;
