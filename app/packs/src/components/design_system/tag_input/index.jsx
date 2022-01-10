import React, { useState } from "react";
import { bool, string, arrayOf } from "prop-types";
import P2 from "../typography/p2";
import OptionalTag from "../optional_tag";
import cx from "classnames";

const TagInput = ({
  className,
  tags,
  label,
  caption,
  mode,
  disabled,
  onTagChange,
}) => {
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
      onTagChange([...localTags, input]);
      setLocalTags((prevState) => [...prevState, input]);
      setInput("");
    }

    if (key === "Backspace" && !input.length && localTags.length) {
      const tagsCopy = [...localTags];
      const poppedTag = tagsCopy.pop();
      e.preventDefault();
      setLocalTags(tagsCopy);
      onTagChange(tagsCopy);
      setInput(poppedTag);
    }
  };

  const deleteTag = (index) => {
    const newTags = localTags.filter((_tag, i) => i !== index);
    onTagChange(newTags);
    setLocalTags(newTags);
  };

  return (
    <div className={cx("d-flex", "flex-column", className)}>
      {label && <P2 bold text={label} mode={mode} className="mb-2" />}
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
    </div>
  );
};

TagInput.defaultProps = {
  className: "",
  tags: [],
  mode: "light",
  disabled: false,
  caption: null,
  label: null,
};

TagInput.propTypes = {
  className: string,
  tags: arrayOf(string),
  mode: string,
  disabled: bool,
  caption: string,
  label: string,
};

export default TagInput;
