import React, { useState } from "react";
import { string, bool } from "prop-types";
import currency from "currency.js";

import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Divider from "src/components/design_system/other/Divider";
import Tag from "src/components/design_system/tag";
import { H5, P1, P2, P3 } from "src/components/design_system/typography";
import { useWindowDimensionsHook } from "src/utils/window";
import { Star } from "src/components/icons";
import { func } from "prop-types";

const NewTalentCard = ({
  name,
  ticker,
  occupation,
  profilePictureUrl,
  headline,
  isFollowing,
  updateFollow,
  talentLink,
  marketCap,
  supporterCount,
}) => {
  const { mobile } = useWindowDimensionsHook();
  const [showUserDetails, setShowUserDetails] = useState(false);

  const updateFollowing = (e) => {
    e.preventDefault();
    updateFollow();
  };

  return (
    <div
      className="talent-card"
      onMouseEnter={() => setShowUserDetails(true)}
      onMouseLeave={() => setShowUserDetails(false)}
    >
      {!showUserDetails || mobile ? (
        <a className="talent-card-title talent-link" href={talentLink}>
          <div className="d-flex flex-column align-items-center">
            <TalentProfilePicture src={profilePictureUrl} height={120} />
            <H5 className="text-black mt-3 talent-card-name" bold text={name} />
            <P2
              className="text-primary-03 talent-card-occupation"
              text={occupation}
            />
          </div>
          {ticker ? (
            <P2 className="text-primary" bold text={`$${ticker}`} />
          ) : (
            <Tag className="coming-soon-tag">
              <P3 className="current-color" bold text="Coming Soon" />
            </Tag>
          )}
        </a>
      ) : (
        <a className="talent-card-details talent-link" href={talentLink}>
          <div className="d-flex justify-content-between align-items-start w-100">
            <div className="d-flex align-items-center">
              <TalentProfilePicture src={profilePictureUrl} height={32} />
              <div className="d-flex flex-column ml-3">
                <P2
                  className="text-black talent-card-details-title"
                  bold
                  text={name}
                />
                <P3
                  className="text-primary-03 talent-card-details-title"
                  text={occupation}
                />
              </div>
            </div>
            <button
              className="button-link ml-2"
              onClick={(e) => updateFollowing(e)}
            >
              <Star pathClassName={isFollowing ? "star" : "star-outline"} />
            </button>
          </div>
          <P1
            className="text-black talent-card-details-headline mt-3"
            bold
            text={headline}
          />
        </a>
      )}
      <Divider />
      <div className="talent-card-body">
        <div className="d-flex justify-content-between">
          <P3 className="text-primary-04" text="Market cap" />
          <P3 className="text-primary-04" text="Supporters" />
        </div>
        <div className="d-flex justify-content-between">
          <P2
            className="text-black"
            text={ticker ? `${currency(marketCap).format()}` : "-"}
          />
          <P2
            className="text-black"
            text={ticker ? `${supporterCount}` : "-"}
          />
        </div>
      </div>
    </div>
  );
};

NewTalentCard.defaultProps = {
  ticker: "",
  occupation: "",
  profilePictureUrl: "",
  headline: "",
  marketCap: "",
  supporterCount: "0",
};

NewTalentCard.propTypes = {
  name: string.isRequired,
  ticker: string,
  occupation: string,
  profilePictureUrl: string,
  headline: string,
  isFollowing: bool.isRequired,
  updateFollow: func.isRequired,
  talentLink: string.isRequired,
  marketCap: string,
  supporterCount: string,
};

export default NewTalentCard;
