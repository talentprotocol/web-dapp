import React from "react";
import PropTypes from "prop-types";

const H4 = ({
  bold,
  mode,
  text,
  className,
}) => {
  return (
    <h4
      className={
        `
          h4
          ${bold ? 'bold' : ''}
          ${mode}
          ${className}
        `
      }
    >
      {text}
    </h4>
  )
};

H4.defaultProps = {};

H4.propTypes = {
  bold: PropTypes.bool,
  mode: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default H4;
