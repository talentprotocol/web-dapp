import React, { useState } from "react";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { ethers } from "ethers";

import { post, destroy } from "src/utils/requests";

import TalentProfilePicture from "./TalentProfilePicture";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/10292/talent-protocol/v0.0.14",
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

const TalentTable = ({ talents }) => {
  const [changingFollow, setChangingFollow] = useState(false);
  const { loading, error, data } = useQuery(GET_TALENT_PORTFOLIO);
  const getInitialFollows = () => {
    const allFollows = {};

    talents.forEach((talent) => {
      allFollows[talent.id] = talent.isFollowing;
    });

    return allFollows;
  };

  const [follows, setFollows] = useState(getInitialFollows());

  const toggleWatchlist = async (talent) => {
    setChangingFollow(true);
    if (talent.isFollowing) {
      const response = await destroy(
        `/api/v1/follows?user_id=${talent.user_id}`
      ).catch(() => setChangingFollow(false));

      if (response.success) {
        setFollows((prev) => ({ ...prev, [talent.id]: false }));
      }
    } else {
      const response = await post(`/api/v1/follows`, {
        user_id: talent.user_id,
      }).catch(() => setChangingFollow(false));

      if (response.success) {
        setFollows((prev) => ({ ...prev, [talent.id]: true }));
      }
    }
    setChangingFollow(false);
  };

  const getSponsorCount = (contract_id) => {
    if (loading || !data) {
      return 0;
    }

    const chosenTalent = data.talentTokens.find(
      (element) => element.id == contract_id.toLowerCase()
    );

    if (chosenTalent) {
      return ethers.utils.commify(chosenTalent.supporterCounter);
    }
    return 0;
  };

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

  const getProgress = (contract_id) => {
    if (loading || !data) {
      return 0;
    }

    const chosenTalent = data.talentTokens.find(
      (element) => element.id == contract_id.toLowerCase()
    );

    if (chosenTalent) {
      return ethers.BigNumber.from(chosenTalent.totalSupply)
        .div(chosenTalent.maxSupply)
        .mul(100)
        .toNumber();
    }
    return 0;
  };

  console.log(follows);

  return (
    <table className="table table-hover mb-0 mt-4">
      <thead>
        <tr>
          <th
            className="tal-th py-1 text-muted border-bottom-0 border-top-0"
            scope="col"
          ></th>
          <th
            className="tal-th py-1 text-muted border-bottom-0 border-top-0"
            scope="col"
          >
            #
          </th>
          <th
            className="tal-th py-1 text-muted border-bottom-0 border-top-0"
            scope="col"
          >
            <small>TALENT</small>
          </th>
          <th
            className="tal-th py-1 text-muted border-bottom-0 border-top-0"
            scope="col"
          >
            <small>OCCUPATION</small>
          </th>
          <th
            className="tal-th py-1 text-muted border-bottom-0 border-top-0"
            scope="col"
          >
            <small>SUPPORTERS</small>
          </th>
          <th
            className="tal-th py-1 text-muted border-bottom-0 border-top-0"
            scope="col"
          >
            <small>CIRCULATING SUPPLY</small>
          </th>
        </tr>
      </thead>
      <tbody>
        {talents.map((talent) => (
          <tr key={`talent-${talent.contract_id}`} className="tal-tr-item">
            <th className="text-muted align-middle">
              <button
                className="btn border-0 text-warning"
                onClick={() => toggleWatchlist(talent)}
                disabled={changingFollow}
              >
                {follows[talent.id] ? (
                  <FontAwesomeIcon icon={faStar} />
                ) : (
                  <FontAwesomeIcon icon={faStarOutline} />
                )}
              </button>
            </th>
            <th className="text-muted align-middle">{talent.id}</th>
            <th className="text-muted align-middle">
              <TalentProfilePicture
                src={talent.profilePictureUrl}
                height={24}
              />
              {talent.username}{" "}
              <small className="text-warning">{talent.ticker}</small>
            </th>
            <th className="align-middle pr-0" scope="row">
              {talent.occupation}
            </th>
            <th className="align-middle pr-0" scope="row">
              {getSponsorCount(talent.contract_id)}
            </th>
            <td className="align-middle d-flex flex-column">
              <small>
                {getCirculatingSupply(talent.contract_id)} {talent.ticker}
              </small>
              <div className="progress" style={{ height: 6 }}>
                <div
                  className="progress-bar bg-secondary"
                  role="progressbar"
                  aria-valuenow={getProgress(talent.contract_id)}
                  style={{ width: `${getProgress(talent.contract_id)}%` }}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default (props) => (
  <ApolloProvider client={client}>
    <TalentTable {...props} />
  </ApolloProvider>
);
