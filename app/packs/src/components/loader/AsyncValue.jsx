import React from "react";

const AsyncValue = ({ value, size = 3 }) => {
  if (value) {
    return value;
  } else {
    return (
      <span className="animated-background text-white-space-wrap">
        {new Array(size + 1).join(" ")}
      </span>
    );
  }
};

export default AsyncValue;
