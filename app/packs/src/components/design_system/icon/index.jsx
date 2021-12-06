import React from "react";
import { number, string, shape, object } from "prop-types";

const Icon = ({ path, size, color, fill, className, style, viewBox }) => (
  <svg
    className={className}
    style={style}
    viewBox={viewBox}
    width={`${size}px`}
    height={`${size}px`}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    fill={fill}
  >
    <path
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
  style: {},
  className: "",
};

Icon.propTypes = {
  path: string.isRequired,
  size: number,
  color: string,
  fill: string,
  viewBox: string,
  style: shape(object),
  className: string,
};

export default Icon;
