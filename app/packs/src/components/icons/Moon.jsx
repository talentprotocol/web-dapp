import React from "react";
import { number, string } from "prop-types";

const Moon = ({
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
      d="M11.49 10.5C10.474 10.4998 9.47217 10.2614 8.56491 9.80406C7.65765 9.3467 6.87021 8.68307 6.26576 7.8664C5.66132 7.04974 5.25669 6.10277 5.08434 5.10147C4.912 4.10018 4.97673 3.07242 5.27335 2.10066C4.28879 2.55448 3.43343 3.24744 2.78521 4.11642C2.13699 4.98539 1.71651 6.00276 1.56208 7.07582C1.40765 8.14888 1.52418 9.24353 1.90106 10.26C2.27793 11.2765 2.90317 12.1826 3.7198 12.8956C4.53644 13.6086 5.51851 14.106 6.57655 14.3424C7.63459 14.5787 8.73495 14.5466 9.77739 14.2489C10.8198 13.9512 11.7712 13.3974 12.5448 12.6379C13.3185 11.8784 13.8898 10.9374 14.2067 9.90066C13.3554 10.2954 12.4284 10.4999 11.49 10.5Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M7.99002 2.5H10.99"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M9.49002 1V4"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M12.49 5.5H14.49"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className={pathClassName}
      d="M13.49 4.5V6.5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

Moon.defaultProps = {
  size: 16,
  color: "#000000",
  fill: "none",
  viewBox: "0 0 16 16",
  className: "",
  pathClassName: "",
};

Moon.propTypes = {
  size: number,
  color: string,
  fill: string,
  viewBox: string,
  className: string,
  pathClassName: string,
};

export default Moon;
