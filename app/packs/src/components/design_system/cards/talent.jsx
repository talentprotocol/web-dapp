import React from "react";
import DefaultProfilePicture from "images/default-profile-icon.jpg";

const Card = ({
  mode,
  photo_url,
  name,
  title,
  circ_supply,
  ticker,
  href,
  mobile,
  coming_soon,
}) => {
  const imgSrc = photo_url || DefaultProfilePicture;
  const mobileClass = mobile ? " mobile" : "";

  return (
    <a
      className={`card ${mode} card-fixed-width text-reset text-decoration-none mr-3${mobileClass}`}
      href={href}
    >
      <img className="card-img-top" src={imgSrc} alt="Profile picture"></img>

      <div className="card-body d-flex flex-column">
        <h6>{name}</h6>
        <span className={`title ${mode} text-wrap mb-2`}>{title}</span>
        {!mobile && circ_supply && (
          <>
            <p className={`circ-supply ${mode}`}>CIRCULATING SUPPLY</p>
            <strong className={`circ-supply-data ${mode}`}>
              {circ_supply} <span className={`ticker ${mode}`}>{ticker}</span>
            </strong>
          </>
        )}
        {coming_soon && (
          <span className="mt-auto">
            <small className="p-2 text-primary bg-coming-soon rounded talent-link">
              <strong>COMING SOON</strong>
            </small>
          </span>
        )}
      </div>
    </a>
  );
};

export default Card;
