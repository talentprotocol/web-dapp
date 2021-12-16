import React from "react";
import DefaultPicture from "images/default-banner.jpg";

const TalentBanner = ({ src, height, className }) => {
  const imgSrc = src || DefaultPicture;
  return (
    <img
      className={`profile-banner image-fit ${className || ""} `}
      src={imgSrc}
      width="100%"
      height={height}
      alt="Profile Banner"
    />
  );
};

export default TalentBanner;
