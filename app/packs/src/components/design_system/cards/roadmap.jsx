import React from 'react';

const Roadmap = ({
    mode,
    due_date,
    title,
    description
}) => {

    return (
        <div className={`col-md-3 card ${mode}`}>

            <span className={`roadmap-date text-uppercase ${mode}`}>{due_date}</span>

            <p className={`roadmap-title ${mode}`}>
                <strong>{title}</strong>
            </p>

            {description ? <p className={`roadmap-description ${mode}`}>{description}</p> : null}
        </div>
    )
};

export default Roadmap;