import React from "react";

import { P2, P3 } from "src/components/design_system/typography";

const TextInput = ({
  title,
  shortCaption,
  placeholder,
  mode,
  disabled,
  value,
  onChange,
  className,
  maxLength,
  required,
  error,
  id,
  ariaDescribedBy,
  topCaption,
  type = "text",
}) => {
  return (
    <div className={`d-flex flex-column ${className}`}>
      <div className="d-flex flex-row justify-content-between align-items-end mb-2">
        {title ? (
          <P2 bold className="text-black">
            {title} {required && <span className="text-danger">*</span>}
          </P2>
        ) : null}
        {maxLength ? <P2 text={`${value.length}/${maxLength}`} /> : null}
        {topCaption ? <P3 text={topCaption} /> : null}
      </div>

      <input
        id={id}
        type={type}
        className={`form-control ${mode} ${error ? "border-danger" : ""}`}
        aria-describedby={ariaDescribedBy}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
      />

      {shortCaption ? (
        <p className={`short-caption ${mode}`}>{shortCaption}</p>
      ) : null}
    </div>
  );
};

export default TextInput;
