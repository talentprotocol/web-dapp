import React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ethers } from "ethers";

import {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO,
  client,
} from "src/utils/thegraph";

import TalentProfilePicture from "../talent/TalentProfilePicture";

const ActiveTalentLeaderboard = ({ talents }) => {
  const { loading, error, data } = useQuery(GET_TALENT_PORTFOLIO);
  const getCirculatingSupply = (contract_id) => {
    if (loading || !data) {
      return 0;
    }

    const chosenTalent = data.talentTokens.find(
      (element) => element.id == contract_id.toLowerCase()
    );

    if (chosenTalent) {
      return ethers.utils.commify(
        ethers.utils.formatUnits(chosenTalent.totalSupply)
      );
    }
    return 0;
  };

  if (talents.length === 0) {
    return <></>;
  }

  return (
    <div className="d-flex flex-column bg-light px-3 py-4 mb-3">
      <div className="d-flex flex-row w-100 justify-content-between">
        <h6>Talent</h6>
        <a className="text-reset" href="/talent">
          More{" "}
          <FontAwesomeIcon icon={faChevronRight} size="sm" className="ml-2" />
        </a>
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <small className="text-muted">TALENT</small>
        <small className="text-muted">CIRCULATING SUPPLY</small>
      </div>
      {talents.map((talent) => (
        <div
          key={`active_talent_leaderboard_${talent.id}`}
          className="d-flex flex-row justify-content-between mt-3 align-items-center"
        >
          <div className="d-flex flex-row align-items-center">
            <TalentProfilePicture
              src={talent.profilePictureUrl}
              height={24}
              className="mr-3"
            />
            <a className="text-reset" href={`/talent/${talent.username}`}>
              <small>
                {talent.name}{" "}
                <span className="text-muted">{talent.ticker}</span>
              </small>
            </a>
          </div>
          <div className="d-flex flex-row align-items-center">
            <small>
              {getCirculatingSupply(talent.contract_id)} {talent.ticker}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default (props) => (
  <ApolloProvider client={client(props.railsContext.contractsEnv)}>
    <ActiveTalentLeaderboard {...props} />
  </ApolloProvider>
);
