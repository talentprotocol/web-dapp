import React from 'react';
import NotificationTemplate from '../notification';

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
            <div className={`notificationContainer ${mode} col-lg-4`}>
                <NotificationTemplate  type="wallet" mode={mode} title={title} description={description} time_information={time_information} is_new={is_new} />
                <NotificationTemplate type="rocket" mode={mode} title={title} description={description} time_information={time_information} is_new={is_new} />
                <NotificationTemplate type="chat" mode={mode} title={title} description={description} time_information={time_information} is_new={is_new} />
                <NotificationTemplate type="talent" mode={mode} title={title} description={description} time_information={time_information} is_new={is_new} />
                <NotificationTemplate type="star" mode={mode} title={title} description={description} time_information={time_information} is_new={is_new} />
                <NotificationTemplate type="check" mode={mode} title={title} description={description} time_information={time_information} is_new={is_new} />
                <NotificationTemplate type="globe" mode={mode} title={title} description={description} time_information={time_information} is_new={is_new} />
            </div>
        </>
    )
};

export default Notification;