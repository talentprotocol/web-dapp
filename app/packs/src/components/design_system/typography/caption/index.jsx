import React from "react";
import { string, bool, oneOf, func } from "prop-types";
import cx from "classnames";

const Caption = ({ bold, mode, text, className, onClick }) => {
  return (
    <p
      className={cx("caption", bold ? "bold" : "", mode, className)}
      onClick={onClick}
    >
      {text}
    </p>
  );
};

Caption.defaultProps = {
  bold: false,
  mode: "light",
  className: "",
  onClick: () => null,
};

Caption.propTypes = {
  bold: bool,
  mode: oneOf(["light", "dark"]),
  text: string.isRequired,
  className: string,
  onClick: func,
};

export default Caption;
