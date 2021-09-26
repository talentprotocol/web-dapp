import React from "react";

const TalentTags = ({ tags, talent_id, className }) => {
  if (tags && tags.length > 0) {
    return (
      <div className={`d-flex flex-row flex-wrap align-items-center ${className || ""}`}>
        {tags.map((tag) => (
          <div
            key={`${talent_id}_${tag}`}
            className="text-regular p-1 mr-2 border border-light bg-light rounded"
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
