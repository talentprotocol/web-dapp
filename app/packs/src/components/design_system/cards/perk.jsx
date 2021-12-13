import React from 'react';

const Perk = ({
    mode,
    area,
    title,
    my_tokens,
    tokens,
    ticker
}) => {

    return (
        <div className={`col-md-3 card ${mode}`}>

            <div className="row mb-1">
                <span className={`col-lg-6 perk-area text-uppercase ${mode}`}>{area}</span>
                <div className={`col-lg-6 text-right ${mode}`}>
                    {my_tokens >= tokens ? <span className={`tag-available ${mode}`}><strong>Available</strong></span>
                        : <span className={`tag-unavailable ${mode}`}><strong>Hold more {tokens - my_tokens} {ticker}</strong></span>
                    }
                    
                </div>
            </div>
            <strong>{title}</strong>
            <small className={`mt-1 hold-info ${mode}`}>
                Hold +{tokens} {ticker}
            </small>
        </div>
    )
};

export default Perk;