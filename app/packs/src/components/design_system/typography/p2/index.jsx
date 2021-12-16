import React from "react";
import { string, bool, oneOf } from "prop-types";
import cx from "classnames";

const P2 = ({ bold, mode, text, className }) => {
  return (
    <p className={cx("p2", bold ? "bold" : "", mode, className)}>{text}</p>
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
  text: string.isRequired,
  className: string,
};

export default P2;
