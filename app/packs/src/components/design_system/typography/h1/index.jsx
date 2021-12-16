import React from "react";
import { string, bool, oneOf } from "prop-types";
import cx from "classnames";

const H1 = ({ bold, mode, text, className }) => {
  return (
    <h1 className={cx("h1", bold ? "bold" : "", mode, className)}>{text}</h1>
  );
};

H1.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
};

H1.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: string.isRequired,
  className: string,
};

export default H1;
