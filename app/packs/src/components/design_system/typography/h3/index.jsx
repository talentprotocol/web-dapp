import React from "react";
import { string, number, bool, oneOfType, oneOf, node } from "prop-types";
import cx from "classnames";

const H3 = ({ bold, mode, text, children, className }) => {
  return (
    <h3 className={cx("h3", bold ? "bold" : "", mode, className)}>
      {text || children}
    </h3>
  );
};

H3.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
  children: null,
};

H3.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: oneOfType([string, number]),
  className: string,
  children: node,
};

export default H3;
