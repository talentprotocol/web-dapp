import React, { useState, useEffect } from "react";
import { string, bool } from "prop-types";
import { ethers } from "ethers";
import currency from "currency.js";

import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Divider from "src/components/design_system/other/Divider";
import { H5, P1, P2, P3 } from "src/components/design_system/typography";
import { useWindowDimensionsHook } from "src/utils/window";
import { Star } from "src/components/icons";
import { func } from "prop-types";
import {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO_FOR_ID_SIMPLE,
  client,
} from "src/utils/thegraph";

const NewTalentCard = ({
  name,
  ticker,
  occupation,
  profilePictureUrl,
  contractId,
  headline,
  isFollowing,
  updateFollow,
  talentLink,
}) => {
  const { mobile } = useWindowDimensionsHook();
  const [tokenData, setTokenData] = useState({
    totalSupply: 0,
    supporterCount: 0,
  });
  const [showUserDetails, setShowUserDetails] = useState(false);
  const { loading, data } = useQuery(GET_TALENT_PORTFOLIO_FOR_ID_SIMPLE, {
    variables: { id: contractId?.toLowerCase() },
  });

  const updateFollowing = (e) => {
    e.preventDefault();
    updateFollow();
  };

  useEffect(() => {
    if (loading || !data || !data.talentToken) {
      return;
    }

    setTokenData({
      totalSupply: ethers.utils.formatUnits(data.talentToken.totalSupply || 0),
      supporterCount: data.talentToken.supporterCounter || 0,
    });
  }, [data, loading]);

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
          {ticker && <P2 className="text-primary" bold text={`$${ticker}`} />}
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
              className="button-link ml-2 z-index-1"
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
            text={`${currency(tokenData.totalSupply).format()}`}
          />
          <P2 className="text-black" text={`${tokenData.supporterCount}`} />
        </div>
      </div>
    </div>
  );
};

NewTalentCard.propTypes = {
  name: string.isRequired,
  ticker: string,
  occupation: string,
  profilePictureUrl: string,
  contractId: string,
  headline: string,
  isFollowing: bool.isRequired,
  updateFollow: func.isRequired,
  talentLink: string.isRequired,
};

export default (props) => (
  <ApolloProvider client={client(props.railsContext.contractsEnv)}>
    <NewTalentCard {...props} />
  </ApolloProvider>
);
