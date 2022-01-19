import React from "react";
import { string, number, oneOfType, bool } from "prop-types";
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

TalentProfilePicture.defaultProps = {
  src: null,
  height: 24,
  greyscale: null,
  className: null,
  straight: null,
  blur: null,
  border: null,
};

TalentProfilePicture.propTypes = {
  src: string,
  height: oneOfType([number, string]),
  greyscale: bool,
  className: string,
  straight: bool,
  blur: bool,
  border: bool,
};

export default TalentProfilePicture;
