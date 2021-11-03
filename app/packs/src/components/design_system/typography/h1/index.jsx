import React from "react";
import PropTypes from "prop-types";

const H1 = ({
  bold,
  mode,
  text,
  className,
}) => {
  return (
    <h1
      className={
        `
          h1
          ${bold ? 'bold' : ''}
          ${mode}
          ${className}
        `
      }
    >
      {text}
    </h1>
  )
};

H1.defaultProps = {};

H1.propTypes = {
  bold: PropTypes.bool,
  mode: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default H1;
