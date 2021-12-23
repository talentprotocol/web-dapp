import React from "react";

const TextInput = ({ title, shortCaption, placeholder, mode, disabled }) => {
  return (
    <>
      {title ? <h6 className={`title-field ${mode}`}>{title}</h6> : null}

      <input
        type="number"
        className={`form-control ${mode}`}
        placeholder={placeholder}
        disabled={disabled}
      />

      {shortCaption ? (
        <p className={`short-caption ${mode}`}>{shortCaption}</p>
      ) : null}
    </>
  );
};

export default TextInput;
