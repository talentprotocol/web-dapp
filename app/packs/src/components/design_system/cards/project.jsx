import React from "react";
import ExternalLink from "src/components/icons/ExternalLink";
import Caption from "src/components/design_system/typography/caption";
import cx from "classnames";

const Project = ({
  mode,
  organization,
  title,
  description,
  location,
  website_link,
  image_url,
  className,
}) => {
  return (
    <div className={`${mode} ${className}`}>
      {/* <span className={`project-tag ${mode}`}>
        <strong>Project</strong>
      </span> */}
      <p className={`project-title ${mode}`}>
        <strong>{title}</strong>
        {website_link ? (
          <a
            target="_blank"
            className={`project-websitelink ${mode}`}
            href={`${website_link}`}
          >
            <ExternalLink pathClassName={cx("icon-theme", mode)} />
          </a>
        ) : null}
      </p>
      {organization && (
        <Caption
          className="project-organization"
          mode={`${mode}`}
          text={`${organization}`}
        />
      )}
      {location && (
        <Caption
          className="project-location"
          mode={`${mode}`}
          text={`${location}`}
        />
      )}
      {description && (
        <Caption
          className="project-description"
          mode={`${mode}`}
          text={`${description}`}
        />
      )}
      {image_url && <img className="project-image" src={`${image_url}`} />}
    </div>
  );
};

export default Project;
