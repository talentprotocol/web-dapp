import React from "react";
import { string, bool, oneOf } from "prop-types";
import cx from "classnames";

const Caption = ({ bold, mode, text, className }) => {
  return (
    <p className={cx("caption", bold ? "bold" : "", mode, className)}>{text}</p>
  );
};

Caption.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
};

Caption.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: string.isRequired,
  className: string,
};

export default Caption;
