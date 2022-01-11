import React from "react";
import { number, string } from "prop-types";

const Spinner = ({ className, pathClassName, style, width }) => (
  <svg
    className={className}
    viewBox={"0 0 65 64"}
    width={`${width}px`}
    height={`${width}px`}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    style={style}
    id="loading"
  >
    <path
      className={pathClassName}
      opacity="0.3"
      d="M64.5 32C64.5 49.6731 50.1731 64 32.5 64C14.8269 64 0.5 49.6731 0.5 32C0.5 14.3269 14.8269 0 32.5 0C50.1731 0 64.5 14.3269 64.5 32ZM3.7 32C3.7 47.9058 16.5942 60.8 32.5 60.8C48.4058 60.8 61.3 47.9058 61.3 32C61.3 16.0942 48.4058 3.2 32.5 3.2C16.5942 3.2 3.7 16.0942 3.7 32Z"
      fill="#686C74"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M32.5 0C38.4015 7.03749e-08 44.1881 1.63198 49.22 4.71551C54.2518 7.79905 58.333 12.214 61.0122 17.4723C63.6914 22.7306 64.8644 28.6274 64.4014 34.5107C63.9383 40.394 61.8574 46.0347 58.3885 50.8091L55.7997 48.9282C58.9216 44.6312 60.7945 39.5546 61.2112 34.2596C61.6279 28.9646 60.5723 23.6575 58.161 18.9251C55.7497 14.1926 52.0766 10.2191 47.548 7.44396C43.0193 4.66878 37.8114 3.2 32.5 3.2V0Z"
      fill="#7A55FF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

Spinner.defaultProps = {
  className: "",
  pathClassName: "",
  width: 64,
};

Spinner.propTypes = {
  className: string,
  pathClassName: string,
  width: number,
};

export default Spinner;
