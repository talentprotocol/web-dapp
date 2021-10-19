import React, { useState } from "react";

import { Dropdown } from "react-bootstrap";
import Rocket from "../icons/Rocket";
import Bell from "../icons/Bell";
import Chat from "../icons/Chat";
import Talent from "../icons/Talent";
import Star from "../icons/Star";
import { formatDistance } from "date-fns";
import { patch } from "src/utils/requests";

const Notification = ({ notification }) => {
  const presentDay = new Date();
  const createdAt = new Date(notification.created_at);

  const icon = () => {
    switch (notification.type) {
      case 'Notifications::TokenAcquired':
        return <Rocket />;
      case 'Notifications::MessageReceived':
        return <Chat />;
      case 'Notifications::TalentListed':
        return <Talent />;
      case 'Notifications::TalentChanged':
        return <Star />;
      default:
        return <Rocket />;
    }
  };

  return (
    <div className="d-flex py-2 text-wrap">
      <section className="d-flex flex-column col-1">
        {icon()}
      </section>
      <section className="d-flex flex-column col-10">
        <div>
          <small className="text-black mb-2 d-block">{notification.title}</small>
          <small className="text-secondary mb-2 d-block">{notification.body}</small>
          <small className="text-secondary d-block">{formatDistance(presentDay, createdAt)}</small>
        </div>
      </section>
      <section className="d-flex flex-column col-1">
        {!notification.read && <span className="notification-unread-icon"></span>}
      </section>
    </div>
  )
}

const Notifications = ({ notifications }) => {
  const [currentNotifications] = useState(notifications);

  const notificationHref = (type, talentId, sourceTalentId) => {
    switch (type) {
      case 'Notifications::TokenAcquired':
        return `/talent/${talentId}/supporters`;
      case 'Notifications::MessageReceived':
        return '/messages';
      case 'Notifications::TalentListed':
        return '/talent';
      case 'Notifications::TalentChanged':
        return `/talent/${sourceTalentId}`;
      default:
        return '';
    }
  };

  const notificationsUnread = currentNotifications.some(
    (notif) => notif.read === false
  );

  const notificationRead = async (notificationId) => {
    await patch(`/api/v1/notifications/${notificationId}`, {
      notification: { read: true },
    });
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          className="user-menu-dropdown-btn no-caret"
          id="notifications-dropdown"
        >
          <Bell />
          {notificationsUnread && <span className="notifications-unread-icon"></span>}
        </Dropdown.Toggle>

        <Dropdown.Menu className="notifications-menu">
          {currentNotifications.length == 0 && (
            <Dropdown.ItemText key="no-notifications">
              <small className="w-100 text-center">No notifications</small>
            </Dropdown.ItemText>
          )}
          {currentNotifications.map((notification) => (
            <Dropdown.Item
              key={`${notification.id}-notification`}
              // type={`${
              //   notification.read ? "outline-secondary" : "primary"
              // }`}
              className="p-0"
              href={notificationHref(notification.type ,notification.talent_id, notification.source_talent_id)}
              onClick={() => notification.read ? null : notificationRead(notification.id)}
            >
              <Notification
                notification={notification}
              />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default Notifications;
