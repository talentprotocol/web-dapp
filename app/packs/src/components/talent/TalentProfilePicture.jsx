import React from "react";
import DefaultProfilePicture from "images/default-profile-icon.jpg";

const TalentProfilePicture = ({
  src,
  height,
  greyscale,
  className,
  straight,
}) => {
  const imgSrc = src || DefaultProfilePicture;
  const grey = greyscale ? " image-greyscale" : "";
  const roundPhoto = straight ? "" : "rounded-circle";
  return (
    <img
      className={`${roundPhoto}${grey} ${className || ""} image-fit`}
      src={imgSrc}
      width={height}
      height={height}
      alt="Profile Picture"
    />
  );
};

export default TalentProfilePicture;
