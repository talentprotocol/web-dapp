import React from "react";
import { string, number, bool, oneOfType, oneOf, node } from "prop-types";
import cx from "classnames";

const P1 = ({ bold, mode, text, children, className }) => {
  return (
    <p className={cx("p1", bold ? "bold" : "", mode, className)}>
      {text || children}
    </p>
  );
};

P1.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
  children: null,
};

P1.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: oneOfType([string, number]),
  children: node,
  className: string,
};

export default P1;
