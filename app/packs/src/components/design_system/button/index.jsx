import React from "react";
import { string, func, oneOf, bool } from "prop-types";
import cx from "classnames";

const Button = ({
  text,
  onClick,
  type,
  mode,
  size,
  disabled,
  className,
  children,
}) => {
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
      disabled={disabled}
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
  disabled: false,
};

Button.propTypes = {
  text: string,
  onClick: func.isRequired,
  type: oneOf([
    "primary-default",
    "primary-outline",
    "primary-ghost",
    "primary-subtle",
    "danger-default",
    "danger-outline",
    "danger-ghost",
    "danger-subtle",
    "positive-default",
    "positive-outline",
    "positive-ghost",
    "positive-subtle",
    "white-default",
    "white-outline",
    "white-ghost",
    "white-subtle",
  ]),
  mode: oneOf(["light", "dark"]),
  size: oneOf(["none", "icon", "normal", "big", "extra-big"]),
  className: string,
  disabled: bool,
};

export default Button;
