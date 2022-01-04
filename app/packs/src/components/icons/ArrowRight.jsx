import React from "react";
import { number, string } from "prop-types";

const ArrowRight = ({
  size,
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
    width={`${size}px`}
    height={`${size}px`}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    fill={fill}
    style={style}
  >
    <path
      className={pathClassName}
      d="M0.5 8H15.5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M8.5 15L15.5 8L8.5 1"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

ArrowRight.defaultProps = {
  size: 16,
  color: "#000000",
  fill: "none",
  viewBox: "0 0 16 16",
  className: "",
  pathClassName: "",
};

ArrowRight.propTypes = {
  size: number,
  color: string,
  fill: string,
  viewBox: string,
  className: string,
  pathClassName: string,
};

export default ArrowRight;
