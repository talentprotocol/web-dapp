import React from "react";
import { string, number, bool, oneOfType, oneOf, node } from "prop-types";
import cx from "classnames";

const H2 = ({ bold, mode, text, children, className }) => {
  return (
    <h2 className={cx("h2", bold ? "bold" : "", mode, className)}>
      {text || children}
    </h2>
  );
};

H2.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
  children: null,
};

H2.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: oneOfType([string, number]),
  className: string,
  children: node,
};

export default H2;
