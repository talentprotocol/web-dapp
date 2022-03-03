import React from "react";
import { string, number, bool, oneOfType, oneOf, func, node } from "prop-types";
import cx from "classnames";

const Caption = ({ bold, mode, text, children, className, onClick }) => {
  return (
    <p
      className={cx("caption", bold ? "bold" : "", mode, className)}
      onClick={onClick}
    >
      {text || children}
    </p>
  );
};

Caption.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
  onClick: () => null,
  children: null,
};

Caption.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: oneOfType([string, number]),
  className: string,
  onClick: func,
  children: node,
};

export default Caption;
