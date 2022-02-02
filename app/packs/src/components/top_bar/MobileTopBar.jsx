import React, { useState } from "react";

import LogoLight from "src/components/icons/LogoLight";
import LogoDark from "src/components/icons/LogoDark";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Notifications from "src/components/notifications";
import UserMenuFullScreen from "src/components/user_menu/UserMenuFullScreen";
import Button from "src/components/design_system/button";

const MobileUserMenu = ({
  mode,
  notifications,
  user,
  toggleTheme,
  connectedButton,
  showConnectButton,
  metamaskButton,
  onClickTransak,
  copyCodeToClipboard,
  inviteNumbers,
  signOut,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const openTransak = (e) => {
    setShowMenu(false);
    onClickTransak(e);
  };

  return (
    <div className="navbar-container">
      <nav className={`navbar ${mode} justify-content-between`}>
        <a href="/">
          {mode == "light" ? (
            <LogoLight width={128} height={20} />
          ) : (
            <LogoDark width={128} height={20} />
          )}
        </a>
        <div className="d-flex flex-row" style={{ height: 26 }}>
          <Notifications
            notifications={notifications}
            mode={mode}
            hideBackground={true}
          />
          <Button
            onClick={() => setShowMenu(true)}
            type="white-ghost"
            mode={mode}
            className="ml-4"
            size="none"
          >
            <TalentProfilePicture src={user.profilePictureUrl} height={20} />
          </Button>
          <UserMenuFullScreen
            show={showMenu}
            hide={() => setShowMenu(false)}
            toggleTheme={toggleTheme}
            mode={mode}
            user={user}
            connectedButton={connectedButton}
            showConnectButton={showConnectButton}
            metamaskButton={metamaskButton}
            onClickTransak={openTransak}
            copyCodeToClipboard={copyCodeToClipboard}
            inviteNumbers={inviteNumbers}
            signOut={signOut}
          />
        </div>
      </nav>
    </div>
  );
};

export default MobileUserMenu;
