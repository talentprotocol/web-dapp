import React from "react";
import { number, string, shape, object } from "prop-types";

const Icon = ({
  path,
  size,
  color,
  fill,
  className,
  pathClassName,
  viewBox,
}) => (
  <svg
    className={className}
    viewBox={viewBox}
    width={`${size}px`}
    height={`${size}px`}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    fill={fill}
  >
    <path
      className={pathClassName}
      d={path}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

Icon.defaultProps = {
  size: 16,
  color: "#000000",
  fill: "none",
  viewBox: "0 0 16 16",
  className: "",
  pathClassName: "",
};

Icon.propTypes = {
  path: string.isRequired,
  size: number,
  color: string,
  fill: string,
  viewBox: string,
  className: string,
  pathClassName: string,
};

export default Icon;
