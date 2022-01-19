import React from "react";
import { string, bool, oneOf, node } from "prop-types";
import cx from "classnames";

const P3 = ({ bold, mode, text, children, className }) => {
  return (
    <p className={cx("p3", bold ? "bold" : "", mode, className)}>
      {text || children}
    </p>
  );
};

P3.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
  text: "",
  children: null,
};

P3.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: string,
  children: node,
  className: string,
};

export default P3;
