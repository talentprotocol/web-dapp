import React from "react";
import { string, bool, oneOf } from "prop-types";
import cx from "classnames";

const P3 = ({ bold, mode, text, className }) => {
  return (
    <p className={cx("p3", bold ? "bold" : "", mode, className)}>{text}</p>
  );
};

P3.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
};

P3.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: string.isRequired,
  className: string,
};

export default P3;
