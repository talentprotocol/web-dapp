import React from "react";
import ArrowBack from "src/components/icons/ArrowBack";
import ArrowForward from "src/components/icons/ArrowForward";
import Bell from "src/components/icons/Bell";
import Metamask from "src/components/icons/Metamask";
import ArrowDown from "src/components/icons/ArrowDown";
import cx from "classnames";

const TopBar = ({
  mode,
  name,
  photo_url,
  count_notifications = 0,
  is_connected = false,
  wallet_balance,
  wallet_address,
}) => {
  return (
    <>
      <nav className={`navbar ${mode} justify-content-end`}>
        <div className="text-right">
          {is_connected == false ? (
            <button className={`button-topbar mr-1 ${mode}`}>
              <Metamask />
              <strong className="m-2">Connect Wallet</strong>
            </button>
          ) : (
            <button className={`button-topbar mr-1 ${mode}`}>
              {wallet_balance ? (
                <strong className={`m2 wallet_balance ${mode}`}>
                  {wallet_balance}
                </strong>
              ) : null}
              {wallet_address ? (
                <strong className={`wallet_address mr-1 ${mode}`}>
                  {" "}
                  {wallet_address}
                </strong>
              ) : null}
            </button>
          )}

          <button className={`button-topbar mr-1 ${mode}`}>
            <img
              className="column table-img"
              src={`${photo_url}`}
              alt="Profile picture"
            ></img>

            <strong className={`ml-1 mr-1 wallet_balance ${mode}`}>
              {name}
            </strong>
            <ArrowDown pathClassName={cx("icon-theme", mode)} />
          </button>

          <button className={`button-topbar button-square ${mode}`}>
            <Bell pathClassName={cx("icon-theme", mode)} />
            {count_notifications > 0 ? (
              <div className="mr-1 ellipse-notifications"></div>
            ) : null}
          </button>
        </div>
      </nav>
    </>
  );
};

export default TopBar;
