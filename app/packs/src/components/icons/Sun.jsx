import React from "react";
import { number, string } from "prop-types";

const Sun = ({
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
      d="M5.00067 8C5.00067 8.79565 5.31674 9.55871 5.87935 10.1213C6.44196 10.6839 7.20502 11 8.00067 11C8.79632 11 9.55938 10.6839 10.122 10.1213C10.6846 9.55871 11.0007 8.79565 11.0007 8C11.0007 7.20435 10.6846 6.44129 10.122 5.87868C9.55938 5.31607 8.79632 5 8.00067 5C7.20502 5 6.44196 5.31607 5.87935 5.87868C5.31674 6.44129 5.00067 7.20435 5.00067 8V8Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M8.00067 1V3"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M8.00067 13V15"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M15.0007 8H13.0007"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M3.00067 8H1.00067"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M12.95 3.05066L11.536 4.46466"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M4.46466 11.536L3.05066 12.95"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M12.95 12.95L11.536 11.536"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M4.46466 4.46466L3.05066 3.05066"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

Sun.defaultProps = {
  size: 16,
  color: "#000000",
  fill: "none",
  viewBox: "0 0 16 16",
  className: "",
  pathClassName: "",
};

Sun.propTypes = {
  size: number,
  color: string,
  fill: string,
  viewBox: string,
  className: string,
  pathClassName: string,
};

export default Sun;
