import React from "react";

import Tag from "src/components/design_system/tag";
import P2 from "src/components/design_system/typography/p2";

const TalentTags = ({ tags, talent_id, className, mode }) => {
  const validTags = tags.filter((item) => item != "");

  if (validTags && validTags.length > 0) {
    return (
      <div
        className={`d-flex flex-row flex-wrap align-items-center ${
          className || ""
        }`}
      >
        {validTags.map((tag) => (
          <Tag mode={mode} className="mr-2 mt-2" key={`${talent_id}_${tag}`}>
            <P2 mode={mode} text={tag} bold />
          </Tag>
        ))}
      </div>
    );
  } else {
    return null;
  }
};

export default TalentTags;
