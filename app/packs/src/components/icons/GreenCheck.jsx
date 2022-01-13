import React from "react";
import { string, number } from "prop-types";

const GreenCheck = ({ className, pathClassName, style, width }) => (
  <svg
    className={className}
    viewBox={"0 0 64 64"}
    width={`${width}px`}
    height={`${width}px`}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    style={style}
  >
    <path
      className={pathClassName}
      d="M64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32ZM3.2 32C3.2 47.9058 16.0942 60.8 32 60.8C47.9058 60.8 60.8 47.9058 60.8 32C60.8 16.0942 47.9058 3.2 32 3.2C16.0942 3.2 3.2 16.0942 3.2 32Z"
      fill="#1DB954"
    />
    <path
      className={pathClassName}
      d="M43 21.5L28.9141 41.6197C28.7283 41.8867 28.4816 42.1057 28.1945 42.2587C27.9074 42.4117 27.588 42.4943 27.2627 42.4997C26.9374 42.5051 26.6154 42.4331 26.3234 42.2897C26.0314 42.1462 25.7776 41.9354 25.5831 41.6747L22 36.8984"
      stroke="#1DB954"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

GreenCheck.defaultProps = {
  className: "",
  pathClassName: "",
  width: 64,
};

GreenCheck.propTypes = {
  className: string,
  pathClassName: string,
  width: number,
};

export default GreenCheck;
