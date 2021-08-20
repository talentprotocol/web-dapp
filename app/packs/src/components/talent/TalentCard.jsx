import React from "react";
import TalentProfilePicture from "./TalentProfilePicture";
import TalentTags from "./TalentTags";

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
            <strong>{talent.token.display_price}</strong>
          </div>
        </div>
        <div className="d-flex flex-column align-items-center">
          <div className="text-muted">
            <small>Market cap</small>
          </div>
          <div>
            <strong>{talent.token.display_market_cap}</strong>
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

export default TalentCard;
