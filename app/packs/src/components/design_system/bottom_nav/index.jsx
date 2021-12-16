import React from "react";
import Talent from "src/components/icons/Talent";
import Chat from "src/components/icons/Chat";
import Wallet from "src/components/icons/Wallet";

import { useWindowDimensionsHook } from "src/utils/window";

import BottomNavItem from "./BottomNavItem";

const BottomNav = ({ mode, talentPath, portfolioPath, messagesPath }) => {
  const { height, width } = useWindowDimensionsHook();

  if (width >= 992) {
    return null;
  }

  return (
    <nav className={`navbar-bottom-mobile ${mode}`}>
      <div className="navbar-bottom-menu">
        <div className="navbar-bottom-menu-option">
          <BottomNavItem
            mode={mode}
            url={talentPath}
            secondaryUrl={"/"}
            routeName="Talent"
            Icon={Talent}
          />
        </div>
        <div className="navbar-bottom-menu-option">
          <BottomNavItem
            mode={mode}
            url={portfolioPath}
            routeName="Portfolio"
            Icon={Wallet}
          />
        </div>
        <div className="navbar-bottom-menu-option">
          <BottomNavItem
            mode={mode}
            url={messagesPath}
            routeName="Messages"
            Icon={Chat}
          />
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
