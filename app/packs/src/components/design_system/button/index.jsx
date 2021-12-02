import React from "react";
import { string, func, oneOf } from "prop-types";
import cx from 'classnames';

const Button = ({
  text,
  onClick,
  type,
  mode,
  size,
  className,
}) => {
  const typeClassName = `${type}-button`;

  return (
    <button
      className={cx(
        'talent-button',
        typeClassName,
        mode,
        `${size}-size-button`,
        className,
      )}
      onClick={onClick}
    >
      {text ? text : children}
    </button>
  )
};

Button.defaultProps = {
  mode: "light",
  size: "base",
  className: '',
};

Button.propTypes = {
  text: string,
  onClick: func,
  type: string.isRequired,
  mode: oneOf(["light", "dark"]),
  size: oneOf(["base", "big", "extra-big"]),
  className: string,
};

export default Button;
