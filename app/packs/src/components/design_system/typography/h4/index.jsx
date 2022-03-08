import React from "react";
import { string, number, bool, oneOfType, oneOf, node } from "prop-types";
import cx from "classnames";

const H4 = ({ bold, mode, text, children, className }) => {
  return (
    <h4 className={cx("h4", bold ? "bold" : "", mode, className)}>
      {text || children}
    </h4>
  );
};

H4.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
  children: null,
};

H4.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: oneOfType([string, number]),
  children: node,
  className: string,
};

export default H4;
