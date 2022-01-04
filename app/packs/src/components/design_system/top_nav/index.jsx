import React from "react";
import LogoLight from "src/components/icons/Logo-Light";
import LogoDark from "src/components/icons/Logo-Dark";
import Bell from "src/components/icons/Bell";
import Search from "src/components/icons/Search";
import cx from "classnames";

const NavTop = ({ mode }) => {
  return (
    <>
      <div className="col-lg-3">
        <nav className={`navbar-top-mobile ${mode}`}>
          <div className="navbar-top-menu">
            <div className="navbar-top-menu-option">
              {mode === "light" ? <LogoLight /> : <LogoDark />}{" "}
            </div>
            <div className="navbar-top-menu">
              <div className="navbar-top-menu-option">
                {" "}
                <Search pathClassName={cx("icon-theme", mode)} />{" "}
              </div>
              <div className="navbar-top-menu-option">
                {" "}
                <Bell pathClassName={cx("icon-theme", mode)} />{" "}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default NavTop;
