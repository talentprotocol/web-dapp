import React from "react";
import { string, bool, oneOf } from "prop-types";
import cx from "classnames";

const H2 = ({ bold, mode, text, className }) => {
  return (
    <h2 className={cx("h2", bold ? "bold" : "", mode, className)}>{text}</h2>
  );
};

H2.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
};

H2.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: string.isRequired,
  className: string,
};

export default H2;
