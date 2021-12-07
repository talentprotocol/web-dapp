import React from "react";
import { string, bool, oneOf } from "prop-types";
import cx from "classnames";

const H4 = ({ bold, mode, text, className }) => {
  return (
    <h4 className={cx("h4", bold ? "bold" : "", mode, className)}>{text}</h4>
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
  text: string.isRequired,
  className: string,
};

export default H4;
