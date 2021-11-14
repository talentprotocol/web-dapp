import React from "react";
import PropTypes from "prop-types";

const Button = (props) => {
  const typeClassName = `${props.type}-button`;

  return (
    <button
      className={
        `
          talent-button
          ${typeClassName}
          ${props.mode}
          ${props.size}-size-button
          ${props.className}
        `
      } 
          style={{ width: '100%' }}
      {...props}
    >
      {props.text ? props.text : props.children}
    </button>
  )
};

Button.defaultProps = {
  mode: "light",
  size: "base"
};

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(["light", "dark"]),
  size: PropTypes.oneOf(["base", "big", "extra-big"]),
};

export default Button;
