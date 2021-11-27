import React from "react";
import { string, bool, func, oneOf } from "prop-types";
import P3 from "../typography/p3";

const Checkbox = ({ checked, onChange, disabled, label, mode }) => (
  <label className="container-checkbox">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <span className="checkmark"></span>
    {label && <P3 text={label} mode={mode} />}
  </label>
);

Checkbox.propTypes = {
  checked: bool.isRequired,
  onChange: func.isRequired,
  disabled: bool,
  label: string,
  mode: oneOf(["light", "dark"]),
};

Checkbox.defaultProps = {
  checked: "",
  onChange: "",
  disabled: false,
  label: null,
  mode: "light",
};

export default Checkbox;
