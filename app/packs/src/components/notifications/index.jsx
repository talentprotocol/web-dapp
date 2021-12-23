import React, { useState } from "react";

import { Dropdown } from "react-bootstrap";
import Rocket from "../icons/Rocket";
import Bell from "../icons/Bell";
import Chat from "../icons/Chat";
import Talent from "../icons/Talent";
import Star from "../icons/Star";
import { formatDistance } from "date-fns";
import { patch } from "src/utils/requests";

import { useWindowDimensionsHook } from "../../utils/window";

const Notification = ({ notification }) => {
  const presentDay = new Date();
  const createdAt = new Date(notification.created_at);

  const icon = () => {
    switch (notification.type) {
      case "Notifications::TokenAcquired":
        return <Rocket />;
      case "Notifications::MessageReceived":
        return <Chat />;
      case "Notifications::TalentListed":
        return <Talent />;
      case "Notifications::TalentChanged":
        return <Star />;
      default:
        return <Rocket />;
    }
  };

  return (
    <div className="d-flex flex-row w-100 py-2 text-wrap">
      <section className="d-flex flex-column ml-2">{icon()}</section>
      <section className="d-flex flex-column mx-2 w-100">
        <div>
          <small className="text-black mb-2 d-block">
            {notification.title}
          </small>
          <small className="text-secondary mb-2 d-block">
            {notification.body}
          </small>
          <small className="text-secondary d-block">
            {formatDistance(presentDay, createdAt)}
          </small>
        </div>
      </section>
      {!notification.read && (
        <div className="d-flex flex-column mr-2">
          <span className="notification-unread-icon"></span>
        </div>
      )}
    </div>
  );
};

const Notifications = ({ notifications, mode }) => {
  const { height, width } = useWindowDimensionsHook();
  const [currentNotifications, setCurrentNotifications] =
    useState(notifications);

  const notificationHref = (type, notification) => {
    switch (type) {
      case "Notifications::TokenAcquired":
        return `/talent/${notification.username}/supporters`;
      case "Notifications::MessageReceived":
        return "/messages";
      case "Notifications::TalentListed":
        return "/talent";
      case "Notifications::TalentChanged":
        return `/talent/${notification.source_username}`;
      default:
        return "";
    }
  };

  const notificationsUnread = currentNotifications.some(
    (notif) => notif.read === false
  );

  const notificationRead = async (notification) => {
    if (!notification.read) {
      await patch(`/api/v1/notifications/${notification.id}`, {
        notification: { read: true },
      });
    }
    window.location.href = notificationHref(notification.type, notification);
  };

  return (
    <>
      <Dropdown drop="bottom">
        <Dropdown.Toggle
          className={`user-menu-dropdown-btn no-caret ${mode}`}
          id="notifications-dropdown"
        >
          <Bell color="currentColor" />
          {notificationsUnread && (
            <span className="notifications-unread-icon"></span>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu
          className="notifications-menu"
          style={width < 400 ? { width: width - 50 } : {}}
        >
          {currentNotifications.length == 0 && (
            <Dropdown.ItemText key="no-notifications">
              <small className="w-100 text-center">No notifications</small>
            </Dropdown.ItemText>
          )}
          {currentNotifications.map((notification) => (
            <Dropdown.Item
              key={`${notification.id}-notification`}
              className="p-0"
              onClick={() => notificationRead(notification)}
            >
              <Notification notification={notification} />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default Notifications;
