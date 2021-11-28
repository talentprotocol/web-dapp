import React from "react";
import { string, bool, oneOf } from "prop-types";
import cx from "classnames";

const P1 = ({ bold, mode, text, className }) => {
  return (
    <p className={cx("p1", bold ? "bold" : "", mode, className)}>{text}</p>
  );
};

P1.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
};

P1.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: string.isRequired,
  className: string,
};

export default P1;
