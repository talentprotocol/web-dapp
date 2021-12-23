import React from "react";

const TextInput = ({ title, shortCaption, placeholder, mode, disabled }) => {
  return (
    <>
      {title ? <h6 className={`title-field ${mode}`}>{title}</h6> : null}

      <textarea
        className={`form-control ${mode}`}
        rows="3"
        placeholder={placeholder}
        disabled={disabled}
      ></textarea>

      {shortCaption ? (
        <p className={`short-caption ${mode}`}>{shortCaption}</p>
      ) : null}
    </>
  );
};

export default TextInput;
