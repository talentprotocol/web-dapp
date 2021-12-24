import React from "react";
import DefaultProfilePicture from "images/default-profile-icon.jpg";

const Card = ({ mode, photo_url, name, title, circ_supply, ticker, href }) => {
  const imgSrc = photo_url || DefaultProfilePicture;
  return (
    <a
      className={`card ${mode} text-reset text-decoration-none mr-3`}
      href={href}
    >
      <img className="card-img-top" src={imgSrc} alt="Profile picture"></img>

      <div className="card-body">
        <h6>{name}</h6>
        <span className={`title ${mode}`}>{title}</span>
        <p className={`circ-supply ${mode}`}>CIRCULATING SUPPLY</p>
        <strong className={`circ-supply-data ${mode}`}>
          {circ_supply} <span className={`ticker ${mode}`}>{ticker}</span>
        </strong>
      </div>
    </a>
  );
};

export default Card;
