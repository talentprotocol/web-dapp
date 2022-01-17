import React from "react";
import NotificationTemplate from "../notification";

const Notification = ({
  type,
  mode,
  title,
  description,
  timeInformation,
  isNew = false,
}) => {
  return (
    <>
      <div className={`notification-container ${mode} col-lg-4`}>
        <NotificationTemplate
          type="wallet"
          mode={mode}
          title={title}
          description={description}
          timeInformation={timeInformation}
          isNew={isNew}
        />
        <NotificationTemplate
          type="rocket"
          mode={mode}
          title={title}
          description={description}
          timeInformation={timeInformation}
          isNew={isNew}
        />
        <NotificationTemplate
          type="chat"
          mode={mode}
          title={title}
          description={description}
          timeInformation={timeInformation}
          isNew={isNew}
        />
        <NotificationTemplate
          type="talent"
          mode={mode}
          title={title}
          description={description}
          timeInformation={timeInformation}
          isNew={isNew}
        />
        <NotificationTemplate
          type="star"
          mode={mode}
          title={title}
          description={description}
          timeInformation={timeInformation}
          isNew={isNew}
        />
        <NotificationTemplate
          type="check"
          mode={mode}
          title={title}
          description={description}
          timeInformation={timeInformation}
          isNew={isNew}
        />
        <NotificationTemplate
          type="globe"
          mode={mode}
          title={title}
          description={description}
          timeInformation={timeInformation}
          isNew={isNew}
        />
      </div>
    </>
  );
};

export default Notification;
