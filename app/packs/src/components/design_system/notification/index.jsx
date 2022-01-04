import React from "react";
import Wallet from "src/components/icons/Wallet";
import Rocket from "src/components/icons/Rocket";
import Chat from "src/components/icons/Chat";
import Talent from "src/components/icons/Talent";
import Star from "src/components/icons/Star";
import Check from "src/components/icons/Check";
import Globe from "src/components/icons/Globe";
import cx from "classnames";

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
          {type === "wallet" && (
            <Wallet pathClassName={cx("icon-theme", mode)} />
          )}
          {type === "rocket" && (
            <Rocket pathClassName={cx("icon-theme", mode)} />
          )}
          {type === "chat" && <Chat pathClassName={cx("icon-theme", mode)} />}
          {type === "talent" && (
            <Talent pathClassName={cx("icon-theme", mode)} />
          )}
          {type === "star" && <Star pathClassName={cx("icon-theme", mode)} />}
          {type === "check" && <Check pathClassName={cx("icon-theme", mode)} />}
          {type === "globe" && <Globe pathClassName={cx("icon-theme", mode)} />}
        </div>
        <div className={`d-flex flex-column notification-right-area ${mode}`}>
          <div className="w-100">
            {is_new == true ? <div className="ellipse-new"></div> : null}
            {title ? <strong>{title}</strong> : null}
          </div>
          <div className="w-100">
            {description ? (
              <p className={`notification-description text-wrap ${mode}`}>
                {description}
              </p>
            ) : null}
            {time_information ? (
              <p className={mode}>{time_information}</p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
