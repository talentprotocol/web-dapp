import React from 'react';
import Bell from 'src/components/icons/Bell';

// allow count variable and handle the red ellipse.
const ButtonIconNotification = ({
    count = 0
}) => {

    return (
        <>
            <button className="button-topbar button-square mr-1">
                <Bell />
                {count > 0 ? <div className="ellipse-notifications"></div> : null}

            </button>
        </>
    )
};

export default ButtonIconNotification;