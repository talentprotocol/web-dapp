import React from "react";
import { string, bool, func, oneOf } from "prop-types";
import cx from "classnames";
import P3 from "../typography/p3";

const Checkbox = ({ checked, onChange, disabled, label, mode }) => (
  <label className="container-checkbox">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <span className={cx("checkmark", mode)}></span>
    {label && <P3 className="label-checkbox" text={label} mode={mode} />}
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
