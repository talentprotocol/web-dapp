import React from "react";
import {
  Wallet,
  Rocket,
  Chat,
  Talent,
  Star,
  Check,
  Globe,
  Reward,
} from "src/components/icons";
import { P3 } from "src/components/design_system/typography";
import cx from "classnames";

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
      <div className={cx("notification d-flex", mode)}>
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
          {type === "rewards" && (
            <Reward pathClassName={cx("icon-theme", mode)} />
          )}
        </div>
        <div className={cx("d-flex flex-column notification-right-area", mode)}>
          <div className="w-100 d-flex align-items-center">
            {isNew && <div className="ellipse-new"></div>}
            {title && <P3 bold text={title} className="text-black" />}
          </div>
          <div className="w-100">
            {description && (
              <P3
                className="notification-description text-wrap"
                text={description}
              />
            )}
            {timeInformation && <P3 text={timeInformation} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
