import React from "react";

const TalentTags = ({ tags, talent_id, className }) => {
  if (tags && tags.length > 0) {
    return (
      <div className={`d-flex flex-row flex-wrap ${className || ""}`}>
        {tags.map((tag) => (
          <div
            key={`${talent_id}_${tag}`}
            className="text-regular px-1 mr-2 border border-light rounded-pill"
          >
            <small>
              <strong>{tag}</strong>
            </small>
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
};

export default TalentTags;
