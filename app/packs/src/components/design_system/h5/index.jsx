import React from "react";
import PropTypes from "prop-types";

const H5 = ({
  bold,
  mode,
  text,
  className,
}) => {
  return (
    <h5
      className={
        `
          h5
          ${bold ? 'bold' : ''}
          ${mode}
          ${className}
        `
      }
    >
      {text}
    </h5>
  )
};

H5.defaultProps = {};

H5.propTypes = {
  bold: PropTypes.bool,
  mode: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default H5;
