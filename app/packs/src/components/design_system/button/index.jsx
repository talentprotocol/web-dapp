import React from "react";
import { string, func, oneOf } from "prop-types";
import cx from "classnames";

const Button = ({ text, onClick, type, mode, size, className }) => {
  const typeClassName = `${type}-button`;

  return (
    <button
      className={cx(
        "talent-button",
        typeClassName,
        mode,
        `${size}-size-button`,
        className
      )}
      onClick={onClick}
    >
      {text ? text : children}
    </button>
  );
};

Button.defaultProps = {
  text: null,
  mode: "light",
  size: "normal",
  className: "",
};

Button.propTypes = {
  text: string,
  onClick: func.isRequired,
  type: string.isRequired,
  mode: oneOf(["light", "dark"]),
  size: oneOf(["normal", "big", "extra-big"]),
  className: string,
};

export default Button;
