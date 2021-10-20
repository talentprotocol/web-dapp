import React from "react";
import LogoImage from "images/logo.svg";

const Logo = ({ width, height, bigName, centerText }) => (
  <div className="d-flex flex-row justify-content-center align-items-center">
    <img
      className="mr-2"
      src={LogoImage}
      width={width}
      height={height || "18"}
      alt="Talent Protocol"
    />
    {bigName ? (
      <h1 className={centerText ? "text-center h2" : "h2"}>
        <strong>talent protocol</strong>
      </h1>
    ) : (
      <small>
        <strong>talent protocol</strong>
      </small>
    )}
  </div>
);

export default Logo;
