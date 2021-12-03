import React from 'react';
import ArrowDown from 'src/components/icons/ArrowDown';

const ButtonProfile = ({
    photo_url,
    name
}) => {

    return (
        <>
            <button className="button-topbar mr-1">
                <img className="column table-img" src={`${photo_url}`} alt="Profile picture"></img>

                <strong className="ml-1 mr-1">{name}</strong>
                <ArrowDown/>

            </button>
        </>
    )
};

export default ButtonProfile;