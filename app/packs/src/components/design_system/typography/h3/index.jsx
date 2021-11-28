import React from "react";
import { string, bool, oneOf } from "prop-types";
import cx from "classnames";

const H3 = ({ bold, mode, text, className }) => {
  return (
    <h3 className={cx("h3", bold ? "bold" : "", mode, className)}>{text}</h3>
  );
};

H3.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
};

H3.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: string.isRequired,
  className: string,
};

export default H3;
