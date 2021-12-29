import React from "react";

const TextInput = ({
  title,
  shortCaption,
  placeholder,
  mode,
  disabled,
  value,
  onChange,
  className,
}) => {
  return (
    <div className={`d-flex flex-column ${className}`}>
      {title ? <h6 className={`title-field ${mode}`}>{title}</h6> : null}

      <input
        type="text"
        className={`form-control ${mode}`}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />

      {shortCaption ? (
        <p className={`short-caption ${mode}`}>{shortCaption}</p>
      ) : null}
    </div>
  );
};

export default TextInput;
