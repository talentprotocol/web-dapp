import React, { useEffect, useState } from "react";
import DefaultProfilePictureLight from "images/default-profile-icon-light.png";
import DefaultProfilePictureDark from "images/default-profile-icon-dark.png";

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
  const [currentTheme, setCurrentTheme] = useState(
    document.body.className.split(" ").find((name) => name.includes("body"))
  );
  const mobileClass = mobile ? " mobile" : "";

  const imgSrc = () => {
    if (photo_url) {
      return photo_url;
    } else if (currentTheme === "light-body") {
      return DefaultProfilePictureLight;
    } else if (currentTheme === "dark-body") {
      return DefaultProfilePictureDark;
    }
  };

  useEffect(() => {
    setCurrentTheme(
      document.body.className.split(" ").find((name) => name.includes("body"))
    );
  }, [document.body.className]);

  return (
    <a
      className={`card ${mode} card-fixed-width text-reset text-decoration-none mr-4${mobileClass}`}
      href={href}
    >
      <img
        className="card-img-top card-size"
        src={imgSrc()}
        alt="Profile picture"
      ></img>

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
