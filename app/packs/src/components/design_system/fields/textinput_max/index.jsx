import React from "react";

const TextInputMax = ({ placeholder, mode, disabled }) => {
  return (
    <>
      <div className="input-group border-0">
        <input
          type="number"
          className={`form-control border-0 ${mode}`}
          placeholder={placeholder}
          disabled={disabled}
        />

        <div
          className={`form-control input-group-append col-3 border-0 ${mode}`}
        >
          <div className={`${mode}`}>
            <span className={`${mode}`}>
              TAL |{" "}
              <a href="#">
                <strong>Max</strong>
              </a>{" "}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextInputMax;
