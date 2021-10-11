import React from "react";
import LogoImage from "images/logo.svg";

const Logo = ({ width, height, bigName }) => (
  <div className="d-flex flex-row align-items-center">
    <img
      className="mr-2"
      src={LogoImage}
      width={width}
      height={height || "18"}
      alt="Talent Protocol"
    />
    {bigName ? <h1>Talent Protocol</h1> : <small>Talent Protocol</small>}
  </div>
);

export default Logo;
