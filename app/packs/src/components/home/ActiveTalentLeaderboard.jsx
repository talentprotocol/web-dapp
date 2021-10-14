import React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

import { ethers } from "ethers";
import TalentProfilePicture from "../talent/TalentProfilePicture";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/10292/talent-protocol/v0.0.16",
  cache: new InMemoryCache(),
});

const GET_TALENT_PORTFOLIO = gql`
  query GetTalentList {
    talentTokens {
      id
      supporterCounter
      totalSupply
      maxSupply
      marketCap
      name
    }
  }
`;

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

  return (
    <div className="d-flex flex-column bg-light px-3 py-4 mb-3">
      <div className="d-flex flex-row w-100 justify-content-between">
        <h6>Top Talents</h6>
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
            <small className="mr-3">{talent.id}</small>
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
  <ApolloProvider client={client}>
    <ActiveTalentLeaderboard {...props} />
  </ApolloProvider>
);
