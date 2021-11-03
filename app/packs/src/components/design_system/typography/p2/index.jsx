import React from "react";
import PropTypes from "prop-types";

const P2 = ({
  bold,
  mode,
  text,
  className,
}) => {
  return (
    <p
      className={
        `
          p2
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

P2.defaultProps = {};

P2.propTypes = {
  bold: PropTypes.bool,
  mode: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default P2;
