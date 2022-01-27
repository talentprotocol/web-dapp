import React from "react";
import ExternalLink from "src/components/icons/ExternalLink";
import { Caption, P2, P3 } from "src/components/design_system/typography";
import cx from "classnames";

const ProjectCard = ({
  mode,
  organization,
  title,
  description,
  location,
  websiteLink,
  imageUrl,
  className,
}) => {
  return (
    <div className={className}>
      <div className="mb-3">
        <div className="d-flex">
          <P2 bold text={title} className="text-black" />
          {websiteLink && (
            <a target="_blank" className="ml-2" href={`${websiteLink}`}>
              <ExternalLink pathClassName={cx("icon-theme", mode)} />
            </a>
          )}
        </div>
        {organization && <P2 className="text-black" text={`${organization}`} />}
        {location && <P2 className="text-primary-04" text={`${location}`} />}
      </div>
      {description && (
        <P2 className="text-primary-03" text={`${description}`} />
      )}
      {imageUrl && <img className="project-image" src={`${imageUrl}`} />}
    </div>
  );
};

export default ProjectCard;
