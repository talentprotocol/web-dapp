import React from 'react';

const PortfolioCard = ({
    mode,
    title,
    line1,
    line2
}) => {

    return (
        <div className={`col-md-3 card ${mode}`}>
            {title ? <span className={`portfolio-card-title text-uppercase ${mode}`}>{title}</span> : null}

            {line1 ? <h3 className={`portfolio-card-line1 ${mode}`}> <strong>{line1}</strong> </h3> : null}

            {line2 ? <h5 className={`portfolio-card-line2 ${mode}`}> {line2} </h5> : null}
            
        </div>
    )
};

export default PortfolioCard;