import React from "react";
import { string, bool, oneOf, node } from "prop-types";
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
};

H4.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: string,
  children: node,
  className: string,
};

export default H4;
