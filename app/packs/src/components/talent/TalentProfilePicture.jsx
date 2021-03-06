import React, { useState, useEffect } from "react";
import { string, number, oneOfType, bool } from "prop-types";
import ThemeContainer, { useTheme } from "src/contexts/ThemeContext";
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
  link,
}) => {
  const { mode } = useTheme();

  const imgSrc = () => {
    if (src) {
      return src;
    } else if (mode() === "light" && !straight) {
      return DefaultProfilePictureLight;
    } else if (mode() === "dark" && !straight) {
      return DefaultProfilePictureDark;
    } else if (mode() === "light" && straight) {
      return DefaultBannerLight;
    } else if (mode() === "dark" && straight) {
      return DefaultBannerDark;
    }
  };

  const grey = greyscale ? " image-greyscale " : "";
  const roundPhoto = straight ? "" : "rounded-circle ";
  const blurPhoto = !blur ? "" : "blur-photo ";
  const borderPhoto = !border ? "" : "border-photo ";

  const WithLink = ({ link, children }) =>
    link ? <a href={link}>{children}</a> : children;

  return (
    <WithLink link={link}>
      <img
        className={`${roundPhoto}${grey}${blurPhoto}${borderPhoto} ${
          className || ""
        } image-fit`}
        src={imgSrc()}
        width={width || height}
        height={height}
        alt="Profile Picture"
      />
    </WithLink>
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
  link: null,
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
  link: string,
};
export default (props, _railsContext) => (
  <ThemeContainer>
    <TalentProfilePicture {...props} />
  </ThemeContainer>
);
