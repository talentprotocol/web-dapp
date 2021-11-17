import React from "react";
import PropTypes from "prop-types";

const Slider = (props) => {
  return (
    <label className="form-switch">
      <input type="checkbox" checked={props.checked} onChange={() => props.onClick()} />
      <i />
    </label>
  )
};

Slider.defaultProps = {
  checked: false,
};

Slider.propTypes = {
  onClick: PropTypes.func,
  checked: PropTypes.bool,
};

export default Slider;
