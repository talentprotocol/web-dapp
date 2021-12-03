import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { faEdit, faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import About from "./edit_profile/About";
import Token from "./edit_profile/Token";
import Perks from "./edit_profile/Perks";
import CareerGoal from "./edit_profile/CareerGoal";
import Contacts from "./edit_profile/Contacts";
import Timeline from "./edit_profile/Timeline";

const TokenLaunched = ({ show, setShow, inviteLink }) => {
  const url = `${window.location.origin}${inviteLink}`;

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <Modal scrollable={true} show={show} centered onHide={() => setShow(false)}>
      <Modal.Body className="show-grid p-4">
        <h2>Your token is live</h2>
        <p>Congratulations on launching your talent token!</p>
        <p>
          You probably want your friends and family to be the first ones to buy
          your tokens, right?
        </p>
        <p>
          Share this exclusive link with up to five people so they can have
          early access to the Private Beta and invest in you.
        </p>
        <div className="d-flex flex-column">
          <a href={url} target="self">
            {url}
          </a>
          <button
            onClick={copyLinkToClipboard}
            className="btn btn-primary mt-2"
          >
            Copy link <FontAwesomeIcon icon={faCopy} className="ml-2" />
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const EditProfile = ({ railsContext, ...props }) => {
  const [show, setShow] = useState(false);
  const [tokenLaunched, setTokenLaunched] = useState(false);
  const [activeSection, setActiveSection] = useState("About");
  const allowEdit = props.allowEdit;

  const onTokenLaunch = () => {
    setTokenLaunched(true);
    setShow(false);
  };

  return (
    <>
      {allowEdit && (
        <button
          onClick={() => setShow((prev) => !prev)}
          className="btn btn-light talent-button border-0"
        >
          <FontAwesomeIcon icon={faEdit} /> Edit Profile
        </button>
      )}
      <TokenLaunched
        show={tokenLaunched}
        setShow={setTokenLaunched}
        inviteLink={props.inviteLink}
      />
      <Modal
        size="lg"
        scrollable={true}
        fullscreen={"md-down"}
        show={show}
        centered
        onHide={() => setShow(false)}
      >
        <Modal.Body className="show-grid py-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3 py-3 border-right">
                <p className="text-muted mb-1">
                  <small>Profile</small>
                </p>
                <button
                  type="button"
                  className={`ml-2 my-1 talent-edit-nav-btn text-left w-100 ${
                    activeSection == "About" ? "text-primary" : ""
                  }`}
                  onClick={() => setActiveSection("About")}
                >
                  About
                </button>
                <button
                  type="button"
                  className={`ml-2 my-1 text-left talent-edit-nav-btn w-100 ${
                    activeSection == "Token" ? "text-primary" : ""
                  }`}
                  onClick={() => setActiveSection("Token")}
                >
                  Token
                </button>
                <button
                  type="button"
                  className={`ml-2 my-1 text-left talent-edit-nav-btn w-100 ${
                    activeSection == "Perks" ? "text-primary" : ""
                  }`}
                  onClick={() => setActiveSection("Perks")}
                >
                  Perks
                </button>
                <button
                  type="button"
                  className={`ml-2 my-1 text-left talent-edit-nav-btn w-100 ${
                    activeSection == "CareerGoal" ? "text-primary" : ""
                  }`}
                  onClick={() => setActiveSection("CareerGoal")}
                >
                  Goals
                </button>
                <button
                  type="button"
                  className={`ml-2 my-1 text-left talent-edit-nav-btn w-100 ${
                    activeSection == "Timeline" ? "text-primary" : ""
                  }`}
                  onClick={() => setActiveSection("Timeline")}
                >
                  Timeline
                </button>
                <button
                  type="button"
                  className={`ml-2 my-1 text-left talent-edit-nav-btn w-100 ${
                    activeSection == "Contacts" ? "text-primary" : ""
                  }`}
                  onClick={() => setActiveSection("Contacts")}
                >
                  Contacts
                </button>
              </div>
              {activeSection == "About" && (
                <About close={() => setShow(false)} {...props} />
              )}
              {activeSection == "Token" && (
                <Token
                  close={() => setShow(false)}
                  {...props}
                  railsContext={railsContext}
                  setTokenLaunched={onTokenLaunch}
                />
              )}
              {activeSection == "Perks" && (
                <Perks close={() => setShow(false)} {...props} />
              )}
              {activeSection == "CareerGoal" && (
                <CareerGoal close={() => setShow(false)} {...props} />
              )}
              {activeSection == "Contacts" && (
                <Contacts close={() => setShow(false)} {...props} />
              )}
              {activeSection == "Timeline" && (
                <Timeline close={() => setShow(false)} {...props} />
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditProfile;
