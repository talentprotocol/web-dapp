import React from "react";

const TalentBadges = ({ badges, height }) => {
  if (badges && badges.length > 0) {
    return (
      <div className="d-flex flex-row flex-wrap">
        {badges.map((badge) => (
          <a
            href={badge.url}
            target="_blank"
            key={`${badge.id}_${badge}`}
          >
            <img
              className={"image-fit mr-2"}
              src={badge.imageUrl}
              width={height}
              height={height}
              alt={badge.alt}
            />
          </a>
        ))}
      </div>
    );
  } else {
    return null;
  }
};

export default TalentBadges;
