import React from "react";

const Card = ({ mode, photo_url, name, title, circ_supply, ticker }) => {
  return (
    <div className={`col-md-3 card ${mode}`}>
      <img
        className="card-img-top"
        src={`${photo_url}`}
        alt="Profile picture"
      ></img>

      <div className="card-body">
        <h6>{name}</h6>
        <span className={`title ${mode}`}>{title}</span>
        <p className={`circ-supply ${mode}`}>CIRCULATING SUPPLY</p>
        <strong className={`circ-supply-data ${mode}`}>
          {circ_supply} <span className={`ticker ${mode}`}>{ticker}</span>
        </strong>
      </div>
    </div>
  );
};

export default Card;
