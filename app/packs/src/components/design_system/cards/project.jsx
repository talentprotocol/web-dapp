import React from 'react';
import ExternalLink from 'src/components/icons/ExternalLink';


const Project = ({
    mode,
    organization,
    title,
    description,
    location,
    website_link,
    image_url
}) => {

    return (
        <div className={`col-md-4 ${mode}`}>
            <span className={`project-tag ${mode}`}><strong>Project</strong></span>
            
            <p className={`project-title ${mode}`}>
                <strong>{title}</strong>
                {website_link ? <a target="_blank" className={`project-websitelink ${mode}`} href={`${website_link}`}><ExternalLink color={`${mode === 'dark' ? "#F4F5F5" : "#2D2F32"}`} /></a> : null}
            </p>

            {organization ? <p className={`project-organization ${mode}`}>{organization}</p> : null}
            {location ? <p className={`project-location ${mode}`}>{location}</p> : null}
            {description ? <p className={`project-description ${mode}`}>{description}</p> : null}

            {image_url ? <img className="project-image" src={`${image_url}`}></img>: null}
        </div>
    )
};

export default Project;