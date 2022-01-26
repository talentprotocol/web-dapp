import React, { useEffect, useState, useRef } from "react";

import P2 from "src/components/design_system/typography/p2";

import cx from "classnames";

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
  limitHeight,
  rows,
}) => {
  const textAreaRef = useRef(null);
  const [textAreaHeight, setTextAreaHeight] = useState("auto");

  useEffect(() => {
    const limit = limitHeight || textAreaRef.current.scrollHeight;
    setTextAreaHeight("inherit");
    setTextAreaHeight(
      `${Math.min(textAreaRef.current.scrollHeight, limit) + 6}px`
    );
  }, [value]);

  const onChangeHandler = (e) => {
    setTextAreaHeight("auto");
    if (onChange) onChange(e);
  };

  return (
    <div className={cx("d-flex flex-column", className)}>
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
        ref={textAreaRef}
        rows={rows || 1}
        className={`form-control ${mode} ${error ? "border-danger" : ""}`}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChangeHandler}
        maxLength={maxLength}
        onKeyDown={onKeyDown}
        style={{ height: textAreaHeight }}
      ></textarea>

      {shortCaption ? (
        <p className={`short-caption ${mode}`}>{shortCaption}</p>
      ) : null}
    </div>
  );
};

export default TextArea;
