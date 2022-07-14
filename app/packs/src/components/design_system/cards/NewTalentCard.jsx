import React, { useState, useContext } from "react";
import { string, bool } from "prop-types";

import { ThemeContext } from "src/contexts/ThemeContext";
import currency from "currency.js";

import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Divider from "src/components/design_system/other/Divider";
import Tag from "src/components/design_system/tag";
import { H5, P1, P2, P3 } from "src/components/design_system/typography";
import { useWindowDimensionsHook } from "src/utils/window";
import { Star } from "src/components/icons";
import { func } from "prop-types";
import { Verified } from "../../icons";

const NewTalentCard = ({
  name,
  ticker,
  contractId,
  occupation,
  profilePictureUrl,
  headline,
  isFollowing,
  updateFollow,
  talentLink,
  marketCap,
  supporterCount,
  publicPageViewer,
  isVerified,
}) => {
  const { mobile } = useWindowDimensionsHook();
  const [showUserDetails, setShowUserDetails] = useState(false);
  const theme = useContext(ThemeContext);

  const updateFollowing = (e) => {
    e.preventDefault();
    updateFollow();
  };

  const talentCardFooter = () => (
    <>
      <Divider />
      <div className="talent-card-footer">
        <div className="d-flex justify-content-between">
          <P3 className="text-primary-04" text="Market cap" />
          <P3 className="text-primary-04" text="Supporters" />
        </div>
        <div className="d-flex justify-content-between">
          <P2
            className="text-black"
            text={contractId ? `${currency(marketCap).format()}` : "-"}
          />
          <P2
            className="text-black"
            text={contractId ? `${supporterCount}` : "-"}
          />
        </div>
      </div>
    </>
  );

  return (
    <div
      className="talent-card"
      onMouseEnter={() => setShowUserDetails(true)}
      onMouseLeave={() => setShowUserDetails(false)}
    >
      {!showUserDetails || mobile ? (
        <a className="talent-link" href={talentLink}>
          <div className="talent-card-title">
            <div className="d-flex flex-column align-items-center">
              <TalentProfilePicture src={profilePictureUrl} height={120} />
              <div className="d-inline-flex align-items-baseline">
                <H5
                  className="text-black mt-3 talent-card-name mr-2"
                  bold
                  text={name}
                />
                {isVerified && (
                  <Verified
                    fill={theme.mode() == "light" ? "#9fa3a9" : "#ccced1"}
                  />
                )}
              </div>
              <P2
                className="text-primary-03 talent-card-occupation"
                text={occupation}
              />
            </div>
            {contractId ? (
              <P2 className="text-primary" bold text={`$${ticker}`} />
            ) : (
              <Tag className="coming-soon-tag">
                <P3 className="current-color" bold text="Coming Soon" />
              </Tag>
            )}
          </div>
          {talentCardFooter()}
        </a>
      ) : (
        <a className="talent-link" href={talentLink}>
          <div className="talent-card-details">
            <div className="d-flex justify-content-between align-items-start w-100">
              <div className="d-flex align-items-center">
                <TalentProfilePicture src={profilePictureUrl} height={32} />
                <div className="d-flex flex-column ml-3">
                  <div className="d-inline-flex align-items-baseline">
                    <P2
                      className="text-black talent-card-details-title mr-2"
                      bold
                      text={name}
                    />
                    {isVerified && (
                      <Verified
                        fill={theme.mode() == "light" ? "#9fa3a9" : "#ccced1"}
                      />
                    )}
                  </div>
                  <P3
                    className="text-primary-03 talent-card-details-title"
                    text={occupation}
                  />
                </div>
              </div>
              {!publicPageViewer && (
                <button
                  className="button-link ml-2"
                  onClick={(e) => updateFollowing(e)}
                >
                  <Star pathClassName={isFollowing ? "star" : "star-outline"} />
                </button>
              )}
            </div>
            <P1
              className="text-black talent-card-details-headline mt-3"
              bold
              text={headline}
            />
          </div>
          {talentCardFooter()}
        </a>
      )}
    </div>
  );
};

NewTalentCard.defaultProps = {
  ticker: "",
  contractId: null,
  occupation: "",
  profilePictureUrl: "",
  headline: "",
  marketCap: "",
  supporterCount: "0",
};

NewTalentCard.propTypes = {
  name: string.isRequired,
  ticker: string,
  contractId: string,
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
