import React from "react";
import { string, number, arrayOf, shape } from "prop-types";
import currency from "currency.js";

import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Link from "src/components/design_system/link";
import Tag from "src/components/design_system/tag";
import Divider from "src/components/design_system/other/Divider";
import { P1, P2, P3 } from "src/components/design_system/typography";
import { ArrowForward, Spinner } from "src/components/icons";
import { useWindowDimensionsHook } from "src/utils/window";

import cx from "classnames";

const HighlightsCard = ({ title, talents, className }) => {
  const { mobile } = useWindowDimensionsHook();

  const icon = () => {
    switch (title) {
      case "Most Trendy":
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
          <Link type="primary" text="Discover All" href="/talent" bold />
          <ArrowForward className="ml-2" color="currentColor" size={12} />
        </div>
      </div>
      {!mobile && (
        <>
          <Divider />
          {talents.length > 0 ? (
            <div className="p-4 highlights-card-body">
              {talents.map((talent, index) => (
                <div
                  key={`${talent.id}-${index}`}
                  className="d-flex justify-content-between highlights-card-user"
                >
                  <div className="d-flex align-items-center">
                    <TalentProfilePicture
                      src={talent.profilePictureUrl}
                      height={32}
                    />
                    <P2 className="text-black ml-3" text={talent.name} />
                  </div>
                  {title === "Launching Soon" ? (
                    <Tag className="coming-soon-tag align-self-center ml-2">
                      <P3 className="current-color" bold text="Coming Soon" />
                    </Tag>
                  ) : (
                    <div className="d-flex flex-column align-items-end">
                      <P3 className="text-primary-04" text="Market cap" />
                      <P2
                        className="text-black"
                        text={currency(talent.marketCap).format()}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="highlights-card-body d-flex justify-content-center align-items-center">
              <Spinner />
            </div>
          )}
        </>
      )}
    </div>
  );
};

HighlightsCard.defaultProps = {
  talents: [],
  className: "",
};

HighlightsCard.propTypes = {
  title: string.isRequired,
  talents: arrayOf(
    shape({
      id: number,
      name: string,
      profilePictureUrl: string,
      circulatingSupply: number,
    })
  ),
  className: string,
};

export default HighlightsCard;
