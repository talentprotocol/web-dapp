import React from "react";
import Talent from "src/components/icons/Talent";
import Chat from "src/components/icons/Chat";
import Wallet from "src/components/icons/Wallet";
import Rocket from "src/components/icons/Rocket";

import { useWindowDimensionsHook } from "src/utils/window";

import BottomNavItem from "./BottomNavItem";

const UnreadMessagesIndicator = () => {
  return (
    <div className="position-relative">
      <span
        className="position-absolute badge border border-light rounded-circle bg-danger p-1"
        style={{ height: 0, width: 0, left: 10, top: -22 }}
      >
        &nbsp;
      </span>
    </div>
  );
};

export const BottomNav = ({
  talentPath,
  portfolioPath,
  messagesPath,
  rewardsPath,
  hasUnreadMessages,
}) => {
  const { height, width } = useWindowDimensionsHook();

  if (width >= 992) {
    return null;
  }

  return (
    <nav className="navbar-bottom-mobile">
      <div className="navbar-bottom-menu">
        <div className="navbar-bottom-menu-option">
          <BottomNavItem
            url={talentPath}
            secondaryUrl={"/"}
            routeName="Talent"
            Icon={Talent}
          />
        </div>
        <div className="navbar-bottom-menu-option">
          <BottomNavItem
            url={portfolioPath}
            routeName="Portfolio"
            Icon={Wallet}
          />
        </div>
        <div className="navbar-bottom-menu-option">
          <BottomNavItem url={messagesPath} routeName="Messages" Icon={Chat} />
          {hasUnreadMessages && <UnreadMessagesIndicator />}
        </div>
        <div className="navbar-bottom-menu-option">
          <BottomNavItem url={rewardsPath} routeName="Earn" Icon={Rocket} />
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
