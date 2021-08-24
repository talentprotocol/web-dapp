import React, { useContext } from "react";
import TalentProfilePicture from "./TalentProfilePicture";
import TalentTags from "./TalentTags";

import Web3Container, { Web3Context } from "src/contexts/web3Context";
import AsyncValue from "../loader/AsyncValue";

const TalentBadge = ({ status }) => {
  if (status.toLowerCase() == "active") {
    return (
      <small className="text-success talent-status-badge active py-1 px-2">
        <strong>{"\u25CF Active"}</strong>
      </small>
    );
  } else {
    return (
      <small className="text-warning talent-status-badge upcoming py-1 px-2">
        <strong>{"\u25CF Upcoming"}</strong>
      </small>
    );
  }
};

const textDescription = (text) => {
  if (text && text.length > 275) {
    return `${text.substring(0, 273)}..`;
  } else {
    return text;
  }
};

const TalentCard = ({ talent, href }) => {
  const web3 = useContext(Web3Context);

  const priceOfToken = () => {
    if (web3.tokens[talent.token.contract_id]?.dollarPerToken) {
      return (
        web3.tokens[talent.token.contract_id]?.dollarPerToken *
        web3.talToken?.price
      ).toFixed(2);
    }
  };

  const marketCap = () => {
    if (web3.tokens[talent.token.contract_id]?.reserve) {
      const reserve = parseInt(web3.tokens[talent.token.contract_id]?.reserve);

      return ((reserve * web3.talToken.price) / 100.0).toFixed(2);
    }
  };

  return (
    <a href={href} className="card talent-link border py-3 h-100">
      <div className="card-body px-3 position-relative">
        <TalentProfilePicture src={talent.profilePictureUrl} height={64} />
        <h4 className="card-title mt-2">
          <strong>{talent.username}</strong>
        </h4>
        <h6 className="card-subtitle mb-2 text-primary">
          <strong>{talent.token.display_ticker}</strong>
        </h6>
        <TalentBadge status={talent.status} />
        <p className="card-text">
          <small>{textDescription(talent.description)}</small>
        </p>
        <TalentTags tags={talent.tags} talent_id={talent.id} />
      </div>
      <div className="d-flex flex-row justify-content-around px-3 border-light talent-border-separator-dashed">
        <div className="d-flex flex-column align-items-center">
          <div className="text-muted">
            <small>Price</small>
          </div>
          <div>
            <strong>
              $<AsyncValue value={priceOfToken()} />
            </strong>
          </div>
        </div>
        <div className="d-flex flex-column align-items-center">
          <div className="text-muted">
            <small>Market cap</small>
          </div>
          <div>
            <strong>
              $<AsyncValue value={marketCap()} size={8} />
            </strong>
          </div>
        </div>
        <div className="d-flex flex-column align-items-center">
          <div className="text-muted">
            <small>Sponsors</small>
          </div>
          <div>
            <strong>{talent.sponsor_count}</strong>
          </div>
        </div>
      </div>
    </a>
  );
};

const ConnectedTalentCard = (props) => (
  <Web3Container>
    <TalentCard {...props} />
  </Web3Container>
);

export default ConnectedTalentCard;
