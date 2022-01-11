import React from "react";
import { string, bool, func, oneOf, node } from "prop-types";
import cx from "classnames";
import P3 from "../typography/p3";

const Checkbox = ({
  onChange,
  checked,
  disabled,
  label,
  mode,
  id,
  className,
  htmlFor,
  children,
}) => (
  <label className="container-checkbox" htmlFor={htmlFor}>
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={className}
    />
    <span className={cx("checkmark", mode)}></span>
    {label && <P3 className="label-checkbox" text={label} mode={mode} />}
    {children}
  </label>
);

Checkbox.propTypes = {
  onChange: func.isRequired,
  checked: bool,
  disabled: bool,
  label: string,
  mode: oneOf(["light", "dark"]),
  id: string,
  className: string,
  htmlFor: string,
  children: node,
};

Checkbox.defaultProps = {
  checked: null,
  disabled: false,
  label: null,
  mode: "light",
  id: null,
  className: null,
  htmlFor: null,
  children: null,
};

export default Checkbox;
