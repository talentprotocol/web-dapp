import React from "react";
import { string, bool, oneOf, node } from "prop-types";
import cx from "classnames";

const H5 = ({ bold, mode, text, children, className }) => {
  return (
    <h5 className={cx("h5", bold ? "bold" : "", mode, className)}>
      {text || children}
    </h5>
  );
};

H5.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
};

H5.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: string,
  children: node,
  className: string,
};

export default H5;
