import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import LogoLight from "src/components/icons/LogoLight";
import LogoDark from "src/components/icons/LogoDark";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Notifications from "src/components/notifications";
import Button from "src/components/design_system/button";
import { ArrowLeft, Sun, Moon, ArrowRight, Copy } from "src/components/icons";

import { TERMS_HREF, PRIVACY_HREF } from "src/utils/constants";

const UserMenuFullScreen = ({
  show,
  hide,
  mode,
  toggleTheme,
  user,
  connectedButton,
  showConnectButton,
  metamaskButton,
  onClickTransak,
  copyCodeToClipboard,
  inviteNumbers,
  signOut,
}) => (
  <Modal
    show={show}
    fullscreen="true"
    onHide={hide}
    dialogClassName={"m-0 mh-100 mw-100"}
    backdrop={false}
  >
    <Modal.Body className="d-flex flex-column">
      <div className="d-flex flex-row justify-content-between w-100 pt-2">
        <Button onClick={hide} type="white-ghost" mode={mode}>
          <ArrowLeft color="currentColor" />
        </Button>
        <Button onClick={() => toggleTheme()} type="white-ghost" mode={mode}>
          {mode == "light" ? (
            <Sun color="currentColor" />
          ) : (
            <Moon color="currentColor" />
          )}
        </Button>
      </div>
      <div className="d-flex flex-row w-100 align-items-center my-2">
        <TalentProfilePicture
          src={user.profilePictureUrl}
          height={48}
          className="mr-2"
        />
        <strong>@{user.username}</strong>
      </div>
      <div className="d-flex flex-column w-100 mb-3">
        {!showConnectButton() && connectedButton()}
        {showConnectButton() && metamaskButton()}
        <Button
          onClick={onClickTransak}
          type="primary-default"
          mode={mode}
          className="w-100 my-2"
        >
          <strong>Get Funds</strong>
        </Button>
      </div>
      <div className={`divider ${mode}`}></div>
      <Button
        onClick={() => (window.location.href = `/talent/${user.username}`)}
        type="white-ghost"
        mode={mode}
        className="d-flex flex-row justify-content-between my-3"
      >
        My Profile <ArrowRight color="currentColor" />
      </Button>
      <div className={`divider ${mode}`}></div>
      <Button
        onClick={copyCodeToClipboard}
        type="white-ghost"
        mode={mode}
        className="d-flex flex-row justify-content-between my-3"
      >
        Share invite link{inviteNumbers} <Copy color="currentColor" />
      </Button>
      <div className={`divider ${mode}`}></div>
      <Button
        onClick={() =>
          window.open("https://talentprotocol.typeform.com/feedback", "_blank")
        }
        type="white-ghost"
        mode={mode}
        className="d-flex flex-row justify-content-between mt-3 mb-1"
      >
        Feedback <ArrowRight color="currentColor" />
      </Button>
      <Button
        onClick={() => window.open(TERMS_HREF, "_blank")}
        type="white-ghost"
        mode={mode}
        className="d-flex flex-row justify-content-between mt-1 mb-1"
      >
        Terms & Conditions <ArrowRight color="currentColor" />
      </Button>
      <Button
        onClick={() => window.open(PRIVACY_HREF, "_blank")}
        type="white-ghost"
        mode={mode}
        className="d-flex flex-row justify-content-between mb-3 mt-1"
      >
        Privacy Policy <ArrowRight color="currentColor" />
      </Button>
      <Button onClick={signOut} type="white-subtle" mode={mode}>
        Sign out
      </Button>
    </Modal.Body>
  </Modal>
);

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
    <nav className={`navbar ${mode} justify-content-between`}>
      {mode == "light" ? <LogoLight width={128} /> : <LogoDark width={128} />}
      <div className="d-flex flex-row">
        <Notifications
          notifications={notifications}
          mode={mode}
          hideBackground={true}
        />
        <Button
          onClick={() => setShowMenu(true)}
          type="white-ghost"
          mode={mode}
          className="ml-2"
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
  );
};

export default MobileUserMenu;
