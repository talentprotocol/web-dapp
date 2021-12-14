import React from "react";

const TextInput = ({ title, shortCaption, mode, disabled, options }) => {
  return (
    <>
      {title ? <h6 className={`title-field ${mode}`}>{title}</h6> : null}

      <select className={`form-control ${mode}`} disabled={disabled}>
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>

      {shortCaption ? (
        <p className={`short-caption ${mode}`}>{shortCaption}</p>
      ) : null}
    </>
  );
};

export default TextInput;
