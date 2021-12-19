import React, { useState } from "react";
import { bool, string, arrayOf } from "prop-types";
import P2 from "../typography/p2";
import OptionalTag from "../optional_tag";
import cx from "classnames";
import { array } from "prop-types";

const TagInput = ({ tags, label, caption, mode, disabled }) => {
  const [input, setInput] = useState("");
  const [localTags, setLocalTags] = useState(tags);

  const onChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  const onKeyDown = (e) => {
    const { key } = e;

    if (key === "Enter" && !localTags.includes(input)) {
      e.preventDefault();
      setLocalTags((prevState) => [...prevState, input]);
      setInput("");
    }

    if (key === "Backspace" && !input.length && localTags.length) {
      const tagsCopy = [...localTags];
      const poppedTag = tagsCopy.pop();
      e.preventDefault();
      setLocalTags(tagsCopy);
      setInput(poppedTag);
    }
  };

  const deleteTag = (index) => {
    setLocalTags((prevState) => prevState.filter((_tag, i) => i !== index));
  };

  return (
    <>
      {label && <P2 bold text={label} mode={mode} />}
      <label
        disabled={disabled}
        className={cx("tag-input", "form-control", mode)}
      >
        <div className="tags">
          {localTags.map((tag, index) => (
            <OptionalTag
              key={`${tag}-${index}`}
              text={tag}
              mode={mode}
              closeable
              onClick={() => deleteTag(index)}
            />
          ))}
        </div>
        <input
          className={mode}
          value={input}
          onKeyDown={onKeyDown}
          onChange={onChange}
          disabled={disabled}
        />
      </label>

      {caption && (
        <P2 className="tag-input-caption" mode={mode} text={caption} />
      )}
    </>
  );
};

TagInput.defaultProps = {
  tags: [],
  mode: "light",
  disabled: false,
  caption: null,
  label: null,
};

TagInput.propTypes = {
  tags: arrayOf(string),
  mode: string,
  disabled: bool,
  caption: string,
  label: string,
};

export default TagInput;
