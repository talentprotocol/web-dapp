import React from "react";
import PropTypes from "prop-types";

const P1 = ({
  bold,
  mode,
  text,
  className,
}) => {
  return (
    <p
      className={
        `
          p1
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

P1.defaultProps = {};

P1.propTypes = {
  bold: PropTypes.bool,
  mode: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default P1;
