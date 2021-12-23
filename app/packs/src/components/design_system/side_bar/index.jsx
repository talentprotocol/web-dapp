import React from "react";
import LogoLight from "src/components/icons/Logo-Light";
import LogoDark from "src/components/icons/Logo-Dark";
import Home from "src/components/icons/Home";
import Talent from "src/components/icons/Talent";
import Wallet from "src/components/icons/Wallet";
import Chat from "src/components/icons/Chat";
import cx from "classnames";

const SideBar = ({ mode }) => {
  return (
    <>
      <div className={`side-nav ${mode} col-lg-3 col-md-3 col-sm-6 col-xs-6`}>
        {mode === "light" ? <LogoLight /> : <LogoDark />}

        <ul className={`menu ${mode}`}>
          <li>
            <a href="#" className={`d-flex ${mode} active`}>
              <div className="menu-icon">
                <Home pathClassName={cx("icon-bar", mode)} />
              </div>
              <span>Home</span>
            </a>
          </li>

          <li>
            <a href="#" className={`d-flex ${mode}`}>
              <div className="menu-icon">
                <Talent pathClassName={cx("icon-bar", mode)} />
              </div>
              <span>Talent</span>
            </a>
          </li>

          <li>
            <a href="#" className={`d-flex ${mode}`}>
              <div className="menu-icon">
                <Wallet pathClassName={cx("icon-bar", mode)} />
              </div>
              <span>Portfolio</span>
            </a>
          </li>

          <li>
            <a href="#" className={`d-flex ${mode}`}>
              <div className="menu-icon">
                <Chat pathClassName={cx("icon-bar", mode)} />
              </div>
              <span>Messages</span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SideBar;
