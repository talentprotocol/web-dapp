import React from "react";

const Card = ({ mode, photo_url, name, title, coming_soon = false }) => {
  return (
    <div className={`col-md-2 card mobile ${mode}`}>
      <img
        className="card-img-top"
        src={`${photo_url}`}
        alt="Profile picture"
      ></img>

      <div className="card-body">
        <h6>{name}</h6>
        <span className={`title ${mode}`}>{title}</span>

        {coming_soon == true ? (
          <div className="mt-1">
            <span className={`comingsoon ${mode}`}>Coming soon</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Card;
