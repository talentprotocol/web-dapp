import React from "react";
import DefaultProfilePicture from "images/default-profile-icon.jpg";

const TalentProfilePicture = ({
  src,
  height,
  greyscale,
  className,
  straight,
  blur,
  border,
}) => {
  const imgSrc = src || DefaultProfilePicture;
  const grey = greyscale ? " image-greyscale " : "";
  const roundPhoto = straight ? "" : "rounded-circle ";
  const blurPhoto = !blur ? "" : "blur-photo ";
  const borderPhoto = !border ? "" : "border-photo ";
  return (
    <img
      className={`${roundPhoto}${grey}${blurPhoto}${borderPhoto} ${
        className || ""
      } image-fit`}
      src={imgSrc}
      width={height}
      height={height}
      alt="Profile Picture"
    />
  );
};

export default TalentProfilePicture;
