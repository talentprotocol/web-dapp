import React from 'react';
import ArrowForward from 'src/components/icons/ArrowForward';

const Button = () => {

    return (
        <>
            <button className="button-topbar button-square ml-1" disabled>
                <ArrowForward />
            </button>
        </>
    )
};

export default Button;