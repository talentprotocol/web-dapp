import React from "react";
import PropTypes from "prop-types";

const H2 = ({
  bold,
  mode,
  text,
  className,
}) => {
  return (
    <h2
      className={
        `
          h2
          ${bold ? 'bold' : ''}
          ${mode}
          ${className}
        `
      }
    >
      {text}
    </h2>
  )
};

H2.defaultProps = {};

H2.propTypes = {
  bold: PropTypes.bool,
  mode: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default H2;
