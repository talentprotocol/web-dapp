import React from "react";
import LogoImage from "images/logo-light.svg";

const Logo = ({ width, height }) => (
  <img
    className="d-block"
    src={LogoImage}
    width={width}
    height={height || "18"}
    alt="Talent Protocol"
  />
);

export default Logo;
