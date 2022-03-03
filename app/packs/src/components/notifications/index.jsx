import React, { useState } from "react";

import { Dropdown } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { put, post } from "src/utils/requests";

import { useWindowDimensionsHook } from "../../utils/window";
import NotificationTemplate from "src/components/design_system/notification";
import Button from "src/components/design_system/button";
import Divider from "src/components/design_system/other/Divider";
import { P1, P2 } from "src/components/design_system/typography";
import { Bell, ArrowLeft } from "src/components/icons";
import Link from "src/components/design_system/link";

const Notification = ({ notification, mode }) => {
  const type = () => {
    switch (notification.type) {
      case "TokenAcquiredNotification":
        return "wallet";
      case "MessageReceivedNotification":
        return "chat";
      case "TalentChangedNotification":
        return "star";
      default:
        return "globe";
    }
  };

  return (
    <NotificationTemplate
      type={type()}
      mode={mode}
      title={notification.title}
      description={notification.body}
      timeInformation={dayjs(notification.created_at).fromNow()}
      isNew={!notification.read}
    />
  );
};

const Notifications = ({ notifications, mode, hideBackground = false }) => {
  const { width } = useWindowDimensionsHook();
  const [currentNotifications, setCurrentNotifications] =
    useState(notifications);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsUnread = currentNotifications.some(
    (notif) => notif.read === false
  );

  const notificationRead = async (notification) => {
    if (!notification.read) {
      await put(`/api/v1/notifications/${notification.id}/mark_as_read`);
    }
    if (notification.url) {
      window.location.href = notification.url;
    }
  };

  const markAllAsRead = async () => {
    const request = await post("/api/v1/clear_notifications");
    if (request.success) {
      const newNotifications = notifications.map((n) => ({ ...n, read: true }));
      setCurrentNotifications(newNotifications);
    }
  };

  if (width < 992) {
    return (
      <>
        <Button
          onClick={() => setShowNotifications(true)}
          type="white-ghost"
          mode={mode}
          className="ml-2"
          size="none"
        >
          <Bell color="currentColor" size={20} />
        </Button>
        <Modal
          show={showNotifications}
          fullscreen="true"
          onHide={() => setShowNotifications(false)}
          dialogClassName={"m-0 mh-100 mw-100"}
          backdrop={false}
          className="p-0"
        >
          <Modal.Header className="p-4 align-items-center justify-content-start">
            <Button
              onClick={() => setShowNotifications(false)}
              type="white-ghost"
              size="icon"
              className="d-flex align-items-center mr-4"
            >
              <ArrowLeft color="currentColor" size={16} />
            </Button>
            <P2 className="text-black" bold text="Notifications" />
            <Button
              onClick={() => markAllAsRead()}
              type="white-ghost"
              className="d-flex align-items-center text-primary ml-auto"
            >
              Mark all as read
            </Button>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column p-0">
            {currentNotifications.length == 0 && (
              <small className="w-100 text-center">No notifications</small>
            )}
            {currentNotifications.map((notification) => (
              <div key={`notifications-menu-${notification.id}`}>
                <Divider />
                <Button
                  onClick={() => notificationRead(notification)}
                  type="white-ghost"
                  mode={mode}
                  className="text-left text-black p-0"
                >
                  <Notification notification={notification} mode={mode} />
                </Button>
              </div>
            ))}
          </Modal.Body>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Dropdown drop="bottom" className="ml-2">
        <Dropdown.Toggle
          className="talent-button white-subtle-button normal-size-button no-caret"
          id="notifications-dropdown"
          as="div"
          style={{ height: 34 }}
        >
          <Bell
            color="currentColor"
            style={{
              marginRight: notificationsUnread ? -12 : -3,
              marginTop: -2,
            }}
          />
          {notificationsUnread && (
            <span className="notifications-unread-icon"></span>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu
          className="notifications-menu"
          style={width < 400 ? { width: width - 50 } : {}}
        >
          <div className="d-flex flex-row justify-content-between">
            <P1 bold>Notifications</P1>
            <Link
              disabled={currentNotifications.length == 0}
              text="Mark all as read"
              type="text-primary"
              onClick={markAllAsRead}
            />
          </div>
          {currentNotifications.length == 0 && (
            <Dropdown.ItemText key="no-notifications">
              <small className="w-100 text-center no-notifications-item">
                No notifications
              </small>
            </Dropdown.ItemText>
          )}
          {currentNotifications.map((notification) => (
            <Dropdown.Item
              key={`${notification.id}-notification`}
              className="p-0 notifications-menu-dropdown-item"
              onClick={() => notificationRead(notification)}
            >
              <Notification notification={notification} mode={mode} />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default Notifications;
