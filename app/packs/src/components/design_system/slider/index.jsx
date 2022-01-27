import React from "react";
import { func, bool } from "prop-types";

const Slider = ({ onChange, checked }) => {
  return (
    <label className="form-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <i />
    </label>
  );
};

Slider.defaultProps = {
  checked: false,
};

Slider.propTypes = {
  onChange: func.isRequired,
  checked: bool,
};

export default Slider;
