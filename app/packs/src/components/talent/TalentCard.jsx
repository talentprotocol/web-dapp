import React, { useContext } from "react";
import currency from "currency.js";

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
      return currency(
        web3.tokens[talent.token.contract_id]?.dollarPerToken *
          web3.talToken?.price
      ).format();
    }
  };

  const marketCap = () => {
    if (web3.tokens[talent.token.contract_id]?.reserve) {
      const reserve = parseInt(web3.tokens[talent.token.contract_id]?.reserve);

      return currency((reserve * web3.talToken.price) / 100.0).format();
    }
  };

  return (
    <a href={href} className="card talent-link border pb-3 h-100">
      <div className="card-body position-relative p-0">
        {/* <TalentProfilePicture src={talent.profilePictureUrl} height={64} /> */}
        <img
          src={talent.profilePictureUrl}
          className="card-img-top"
          alt="Profile Picture"
        />
        <h4 className="card-title mt-2 px-3">
          <strong>{talent.display_name || talent.username}</strong>
        </h4>
        <h6 className="card-subtitle mb-2 text-primary px-3">
          <strong>{talent.token.display_ticker}</strong>
        </h6>
        <TalentBadge status={talent.status} />
        <TalentTags className="ml-3" tags={talent.tags} talent_id={talent.id} />
        <p className="card-text px-3">
          <small>{textDescription(talent.headline)}</small>
        </p>
      </div>
      <div className="d-flex flex-row justify-content-around px-3 mt-3 border-light talent-border-separator-dashed">
        <div className="d-flex flex-column align-items-center">
          <div className="text-muted">
            <small>Price</small>
          </div>
          <div>
            <strong>
              <AsyncValue value={priceOfToken()} />
            </strong>
          </div>
        </div>
        <div className="d-flex flex-column align-items-center">
          <div className="text-muted">
            <small>Market cap</small>
          </div>
          <div>
            <strong>
              <AsyncValue value={marketCap()} size={8} />
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
