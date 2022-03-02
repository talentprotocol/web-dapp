import React from "react";
import { string, number, bool, oneOfType, oneOf, node } from "prop-types";
import cx from "classnames";

const H1 = ({ bold, mode, text, children, className }) => {
  return (
    <h1 className={cx("h1", bold ? "bold" : "", mode, className)}>
      {text || children}
    </h1>
  );
};

H1.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
  children: null,
};

H1.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: oneOfType([string, number]),
  className: string,
  children: node,
};

export default H1;
