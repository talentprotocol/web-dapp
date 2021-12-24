import React from "react";
import { number, string } from "prop-types";

const ArrowLeft = ({
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
      d="M15.5 8H0.5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M7.5 1L0.5 8L7.5 15"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

ArrowLeft.defaultProps = {
  size: 16,
  color: "#000000",
  fill: "none",
  viewBox: "0 0 16 16",
  className: "",
  pathClassName: "",
};

ArrowLeft.propTypes = {
  size: number,
  color: string,
  fill: string,
  viewBox: string,
  className: string,
  pathClassName: string,
};

export default ArrowLeft;
