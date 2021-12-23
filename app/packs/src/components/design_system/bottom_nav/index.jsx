import React from "react";
import Star from "src/components/icons/Star";
import Talent from "src/components/icons/Talent";
import Chat from "src/components/icons/Chat";
import Wallet from "src/components/icons/Wallet";
import cx from "classnames";

const NavBottom = ({ mode }) => {
  return (
    <>
      <div className="col-lg-3">
        <nav className={`navbar-bottom-mobile ${mode}`}>
          <div className="navbar-bottom-menu">
            <div className="navbar-bottom-menu-option">
              {" "}
              <Star pathClassName={cx("icon-bar", mode)} />{" "}
            </div>
            <div className="navbar-bottom-menu-option">
              {" "}
              <Talent pathClassName={cx("icon-bar", mode)} />{" "}
            </div>
            <div className="navbar-bottom-menu-option">
              {" "}
              <Chat pathClassName={cx("icon-bar", mode)} />{" "}
            </div>
            <div className="navbar-bottom-menu-option">
              {" "}
              <Wallet pathClassName={cx("icon-bar", mode)} />{" "}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default NavBottom;
