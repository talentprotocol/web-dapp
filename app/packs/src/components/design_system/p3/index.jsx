import React from "react";
import PropTypes from "prop-types";

const P3 = ({
  bold,
  mode,
  text,
  className,
}) => {
  return (
    <p
      className={
        `
          p3
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

P3.defaultProps = {};

P3.propTypes = {
  bold: PropTypes.bool,
  mode: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default P3;
