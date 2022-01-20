import React, { useState, useEffect } from "react";
import { string, number, oneOfType, bool } from "prop-types";
import DefaultProfilePictureLight from "images/default-profile-icon-light.png";
import DefaultProfilePictureDark from "images/default-profile-icon-dark.png";
import DefaultBannerLight from "images/default-banner-light.png";
import DefaultBannerDark from "images/default-banner-dark.png";

const TalentProfilePicture = ({
  src,
  height,
  width,
  greyscale,
  className,
  straight,
  blur,
  border,
}) => {
  const [currentTheme, setCurrentTheme] = useState(document.body.className);

  const imgSrc = () => {
    if (src) {
      return src;
    } else if (currentTheme === "light-body" && !straight) {
      return DefaultProfilePictureLight;
    } else if (currentTheme === "dark-body" && !straight) {
      return DefaultProfilePictureDark;
    } else if (currentTheme === "light-body" && straight) {
      return DefaultBannerLight;
    } else if (currentTheme === "dark-body" && straight) {
      return DefaultBannerDark;
    }
  };

  const grey = greyscale ? " image-greyscale " : "";
  const roundPhoto = straight ? "" : "rounded-circle ";
  const blurPhoto = !blur ? "" : "blur-photo ";
  const borderPhoto = !border ? "" : "border-photo ";

  useEffect(() => {
    setCurrentTheme(document.body.className);
  }, [document.body.className]);

  return (
    <img
      className={`${roundPhoto}${grey}${blurPhoto}${borderPhoto} ${
        className || ""
      } image-fit`}
      src={imgSrc()}
      width={width || height}
      height={height}
      alt="Profile Picture"
    />
  );
};

TalentProfilePicture.defaultProps = {
  src: null,
  height: 24,
  width: null,
  greyscale: null,
  className: null,
  straight: null,
  blur: null,
  border: null,
};

TalentProfilePicture.propTypes = {
  src: string,
  height: oneOfType([number, string]),
  width: oneOfType([number, string]),
  greyscale: bool,
  className: string,
  straight: bool,
  blur: bool,
  border: bool,
};

export default TalentProfilePicture;
