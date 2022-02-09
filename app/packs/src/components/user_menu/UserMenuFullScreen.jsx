import React from "react";
import Modal from "react-bootstrap/Modal";

import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Button from "src/components/design_system/button";
import { ArrowLeft, Sun, Moon, ArrowRight, Copy } from "src/components/icons";
import { P1, P2 } from "src/components/design_system/typography";

import {
  SUPPORTER_GUIDE,
  TALENT_GUIDE,
  TERMS_HREF,
  PRIVACY_HREF,
} from "src/utils/constants";

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
  userHasInvitesLeft,
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
            <Moon color="currentColor" />
          ) : (
            <Sun color="currentColor" />
          )}
        </Button>
      </div>
      <div className="d-flex flex-row w-100 align-items-center my-2">
        <TalentProfilePicture
          src={user.profilePictureUrl}
          height={48}
          className="mr-2"
        />
        <P2 className="text-black" bold text={`@${user.username}`} />
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
          <P1 className="text-black" bold text="Get Funds" />
        </Button>
      </div>
      <div className={`divider ${mode}`}></div>
      <Button
        onClick={() => (window.location.href = `/talent/${user.username}`)}
        type="white-ghost"
        mode={mode}
        className="d-flex flex-row justify-content-between my-3"
      >
        <P1 className="text-black" bold text="My Profile" />
        <ArrowRight color="currentColor" />
      </Button>
      <div className={`divider ${mode}`}></div>
      <Button
        onClick={() =>
          (window.location.href = user.isTalent
            ? `/talent/${user.username}/edit_profile?tab=Invites`
            : `/settings?tab=Invites`)
        }
        type="white-ghost"
        mode={mode}
        className="d-flex flex-row justify-content-between my-3"
      >
        <P1 className="text-black" bold text="Invites" />
        <ArrowRight color="currentColor" />
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
        <P1 className="text-black" bold text="Feedback" />
        <ArrowRight color="currentColor" />
      </Button>
      <Button
        onClick={() => window.open(TERMS_HREF, "_blank")}
        type="white-ghost"
        mode={mode}
        className="d-flex flex-row justify-content-between mt-1 mb-1"
      >
        <P1 className="text-black" bold text="Terms & Conditions" />
        <ArrowRight color="currentColor" />
      </Button>
      <Button
        onClick={() =>
          window.open(user.isTalent ? TALENT_GUIDE : SUPPORTER_GUIDE, "_blank")
        }
        type="white-ghost"
        mode={mode}
        className="d-flex flex-row justify-content-between mb-3 mt-1"
      >
        <P1 className="text-black" bold text="User guide" />
        <ArrowRight color="currentColor" />
      </Button>
      <Button
        onClick={() => window.open(PRIVACY_HREF, "_blank")}
        type="white-ghost"
        mode={mode}
        className="d-flex flex-row justify-content-between mb-3 mt-1"
      >
        <P1 className="text-black" bold text="Privacy Policy" />
        <ArrowRight color="currentColor" />
      </Button>
      <Button onClick={signOut} type="white-subtle" mode={mode}>
        <P1 className="text-black" bold text="Sign out" />
      </Button>
    </Modal.Body>
  </Modal>
);

export default UserMenuFullScreen;
