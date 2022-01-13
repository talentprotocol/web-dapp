import React from "react";
import { number, string } from "prop-types";

const Icon = ({
  path,
  size,
  width,
  height,
  color,
  fill,
  className,
  pathClassName,
  style,
  viewBox,
}) => (
  <svg
    className={className}
    viewBox={viewBox}
    width={width || size}
    height={height || size}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    fill={fill}
    style={style}
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
  width: null,
  height: null,
  color: "#000000",
  fill: "none",
  viewBox: "0 0 16 16",
  className: "",
  pathClassName: "",
};

Icon.propTypes = {
  path: string.isRequired,
  size: number,
  width: string,
  height: string,
  color: string,
  fill: string,
  viewBox: string,
  className: string,
  pathClassName: string,
};

export default Icon;
