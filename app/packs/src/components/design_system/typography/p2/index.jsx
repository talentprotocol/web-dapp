import React from "react";
import { string, bool, oneOf, node } from "prop-types";
import cx from "classnames";

const P2 = ({ bold, mode, text, children, className }) => {
  return (
    <p className={cx("p2", bold ? "bold" : "", mode, className)}>
      {text || children}
    </p>
  );
};

P2.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
};

P2.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: string,
  children: node,
  className: string,
};

export default P2;
