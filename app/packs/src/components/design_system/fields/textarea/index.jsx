import React from "react";

import P2 from "src/components/design_system/typography/p2";

const TextArea = ({
  title,
  shortCaption,
  placeholder,
  mode,
  disabled,
  value,
  onChange,
  className,
  required,
  error,
  maxLength,
  onKeyDown,
}) => {
  return (
    <div className={`d-flex flex-column ${className}`}>
      <div className="d-flex flex-row justify-content-between">
        {title ? (
          <h6 className={`title-field ${mode}`}>
            {title} {required && <span className="text-danger">*</span>}
          </h6>
        ) : null}
        {maxLength ? (
          <P2 mode={mode} text={`${value.length}/${maxLength}`} />
        ) : null}
      </div>
      <textarea
        className={`form-control ${mode} ${error ? "border-danger" : ""}`}
        rows="3"
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        onKeyDown={onKeyDown}
      ></textarea>

      {shortCaption ? (
        <p className={`short-caption ${mode}`}>{shortCaption}</p>
      ) : null}
    </div>
  );
};

export default TextArea;
