import React, { useContext } from "react";

import Web3Container, { Web3Context } from "src/contexts/web3Context";

import TalentProfilePicture from "../talent/TalentProfilePicture";
import AsyncValue from "../loader/AsyncValue";

const TalentLeaderboard = ({ topTalents, className }) => {
  const web3 = useContext(Web3Context);

  const priceOfToken = (talent) => {
    if (
      web3.tokens[talent.token_contract_id]?.dollarPerToken &&
      web3.talToken?.price
    ) {
      return (
        web3.tokens[talent.token_contract_id]?.dollarPerToken *
        web3.talToken?.price
      ).toFixed(2);
    }
  };

  return (
    <div className={`d-flex flex-row flex-wrap border p-3 ${className}`}>
      <p className="mb-0 col-9">
        <small>
          <strong>Top Talent</strong>
        </small>
      </p>
      <p className="mb-0 col-3 text-right text-muted">
        <small>VALUE</small>
      </p>
      {topTalents.length == 0 && (
        <p className="mx-auto">
          <small>Coming soon...</small>
        </p>
      )}
      {topTalents.map((topTalent) => (
        <a
          href={`/talent/${topTalent.id}`}
          className="mt-2 col-12 d-flex flex-row p-0 align-items-center text-reset"
          key={`talent-leaderboard-tal-${topTalent.id}`}
        >
          <div className="col-9 d-flex flex-row align-items-center">
            <TalentProfilePicture
              src={topTalent.profilePictureUrl}
              height={28}
            />
            <div className="d-flex flex-column ml-3">
              <p className="mb-0 leaderboard-info">
                <small>
                  <strong>{topTalent.name}</strong>
                </small>
              </p>
              <p className="mb-0 text-muted leaderboard-info">
                <small>{topTalent.ticker}</small>
              </p>
            </div>
          </div>
          <p className="mb-0 col-3 text-right text-muted leaderboard-info">
            <small>
              {web3.loading ? <AsyncValue /> : `$${priceOfToken(topTalent)}`}
            </small>
          </p>
        </a>
      ))}
    </div>
  );
};

const ConnectedTalentLeaderboard = (props) => (
  <Web3Container>
    <TalentLeaderboard {...props} />
  </Web3Container>
);

export default ConnectedTalentLeaderboard;
