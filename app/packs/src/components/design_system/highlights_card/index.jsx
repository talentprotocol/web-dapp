import React from "react";
import { string } from "prop-types";

import Link from "src/components/design_system/link";
import { P1, P2, P3 } from "src/components/design_system/typography";
import { ArrowForward, Spinner } from "src/components/icons";

import cx from "classnames";

const HighlightsCard = ({ title, link, className }) => {
  const icon = () => {
    switch (title) {
      case "Trending":
        return "🔥";
      case "Latest Added":
        return "🚀";
      case "Launching Soon":
        return "💎";
      default:
        return "";
    }
  };

  return (
    <div className={cx("highlights-card", className)}>
      <div className="d-flex justify-content-between align-items-center p-4 highlights-card-title">
        <div className="d-flex align-items-center">
          <span className="mr-2">{icon()}</span>
          <P1 className="text-black" bold text={title} />
        </div>
        <div className="d-flex align-items-center text-primary">
          <Link
            className="d-flex align-items-center"
            type="primary"
            text="Discover All"
            href={link}
            bold
          >
            <ArrowForward className="ml-2" color="currentColor" size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

HighlightsCard.defaultProps = {
  className: "",
};

HighlightsCard.propTypes = {
  title: string.isRequired,
  link: string.isRequired,
  className: string,
};

export default HighlightsCard;
