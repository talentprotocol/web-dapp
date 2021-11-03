import React from "react";
import PropTypes from "prop-types";

const H3 = ({
  bold,
  mode,
  text,
  className,
}) => {
  return (
    <h3
      className={
        `
          h3
          ${bold ? 'bold' : ''}
          ${mode}
          ${className}
        `
      }
    >
      {text}
    </h3>
  )
};

H3.defaultProps = {};

H3.propTypes = {
  bold: PropTypes.bool,
  mode: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default H3;
