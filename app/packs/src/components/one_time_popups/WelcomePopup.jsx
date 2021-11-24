import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { patch } from "src/utils/requests";

const TalentContent = () => (
  <>
    <Modal.Header closeButton>
      <Modal.Title className="px-3">🎉 Congratulations!</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="d-flex flex-column w-100 p-3">
        <p>
          You're one of the trailblazers launching a token on Talent Protocol's
          1st season!
        </p>
        <p>
          Read this onboarding guide that will help you complete your profile,
          launch your token, and find your first supporters.
        </p>
        <p>
          We're still in early beta, but already live on the Celo blockchain.
          Beta users like you have access to the $TAL token at a discounted
          price, and will be able to earn a high amount of rewards.
        </p>
        <p>Thank you for being an early believer in the project.</p>
        <a
          className="btn btn-primary"
          href="https://talentprotocol.notion.site/Talent-Onboarding-Guide-4a7fcc0ede144f8296c418bb173e45ff"
          target="self"
        >
          Check the Talent Guide
        </a>
      </div>
    </Modal.Body>
  </>
);

const SupporterContent = () => (
  <>
    <Modal.Header closeButton>
      <Modal.Title className="px-3">💎 Welcome!</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="d-flex flex-column w-100 p-3">
        <p>
          You're officially part of Talent Protocol, a platform where talent can
          launch a token and where supporters can back them.
        </p>
        <p>
          Read this onboarding guide that will help you set up your account,
          explore the platform and buy your first Talent Tokens.
        </p>
        <p>
          We're still in early beta, but already live on the Celo blockchain.
          Beta users like you have access to the $TAL token at a discounted
          price, and will be able to earn a high amount of rewards.
        </p>
        <p>Thank you for being an early believer in the project.</p>
        <a
          className="btn btn-primary"
          href="https://talentprotocol.notion.site/Supporter-Onboarding-Guide-1b9a378cb8224ba89ea5aff69cbf5735"
          target="self"
        >
          Check the Supporter Guide
        </a>
      </div>
    </Modal.Body>
  </>
);

const WelcomePopup = ({ talent, user_id }) => {
  const [show, setShow] = useState(true);

  const onClose = () => {
    patch(`/api/v1/users/${user_id}`, {
      welcome_pop_up: true,
    });

    setShow(false);
  };

  return (
    <Modal
      scrollable={true}
      fullscreen={"md-down"}
      show={show}
      centered
      onHide={onClose}
    >
      {talent ? <TalentContent /> : <SupporterContent />}
    </Modal>
  );
};

export default WelcomePopup;
