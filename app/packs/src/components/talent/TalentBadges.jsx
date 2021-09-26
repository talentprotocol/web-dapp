import React from "react";

const TalentBadges = ({ badges, height }) => {
  if (badges && badges.length > 0) {
    return (
      <div className="d-flex flex-row flex-wrap">
        {badges.map((badge) => (
            <img
              key={`${badge.id}_${badge}`}
              className={"image-fit px-1 mr-2 border border-light rounded-pill"}
              src={badge.imageUrl}
              width={height}
              height={height}
              alt={badge.alt}
            />
        ))}
      </div>
    );
  } else {
    return null;
  }
};

export default TalentBadges;
