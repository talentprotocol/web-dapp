import React from "react";
import LogoImage from "images/logo.png";

const Logo = ({ width, height }) => (
  <div className="d-flex flex-row align-items-center">
    <img
      className="mr-2"
      src={LogoImage}
      width={width}
      height={height || "18"}
      alt="Talent Protocol"
    />
    <small>Talent Protocol</small>
  </div>
);

export default Logo;
