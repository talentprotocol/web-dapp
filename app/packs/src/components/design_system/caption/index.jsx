import React from "react";
import PropTypes from "prop-types";

const Caption = ({
  bold,
  mode,
  text,
  className,
}) => {
  return (
    <p
      className={
        `
          caption
          ${bold ? 'bold' : ''}
          ${mode}
          ${className}
        `
      }
    >
      {text}
    </p>
  )
};

Caption.defaultProps = {};

Caption.propTypes = {
  bold: PropTypes.bool,
  mode: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default Caption;
