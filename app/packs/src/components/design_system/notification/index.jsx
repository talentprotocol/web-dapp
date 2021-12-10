import React from 'react';
import Wallet from 'src/components/icons/Wallet';
import Rocket from 'src/components/icons/Rocket';
import Chat from 'src/components/icons/Chat';
import Talent from 'src/components/icons/Talent';
import Star from 'src/components/icons/Star';
import Check from 'src/components/icons/Check';
import Globe from 'src/components/icons/Globe';

const Notification = ({
    type,
    mode,
    title,
    description,
    time_information,
    is_new = false,
}) => {

    return (
        <>
            <div className={`notification ${mode} d-flex`}>
                <div className="notification-icon">
                    {type === 'wallet' && <Wallet color={`${mode === 'dark' ? "#FFF" : "#202122"}`} />}
                    {type === 'rocket' && <Rocket color={`${mode === 'dark' ? "#FFF" : "#202122"}`} />}
                    {type === 'chat' && <Chat color={`${mode === 'dark' ? "#FFF" : "#202122"}`} />}
                    {type === 'talent' && <Talent color={`${mode === 'dark' ? "#FFF" : "#202122"}`} />}
                    {type === 'star' && <Star color={`${mode === 'dark' ? "#FFF" : "#202122"}`} />}
                    {type === 'check' && <Check color={`${mode === 'dark' ? "#FFF" : "#202122"}`} />}
                    {type === 'globe' && <Globe color={`${mode === 'dark' ? "#FFF" : "#202122"}`} />}
                </div>
                <div className="row notificationRightArea">
                    <div className="col-lg-12">
                        {is_new == true ? <div className="ellipse-new"></div> : null}
                        {title ? <strong>{title}</strong> : null}
                    </div>
                    <div className="col-lg-12">
                        {description ? <p>{description}</p> : null}
                        {time_information ? <p>{time_information}</p> : null}
                    </div>


                </div>
            </div>
        </>
    )
};

export default Notification;