import React from "react";
import Copy from "src/components/icons/Copy";

const Card = ({ mode, photo_url, name, address_wallet }) => {
  return (
    <div className={`col-md-3 card ${mode}`}>
      <img
        className="card-img-top"
        src={`${photo_url}`}
        alt="Profile picture"
      ></img>

      <div className="card-body">
        <h6>{name}</h6>
        <span className={`title ${mode}`}>
          <strong>Address:</strong> {address_wallet}
          <Copy color="#AAADB3" />
        </span>
      </div>
    </div>
  );
};

export default Card;
