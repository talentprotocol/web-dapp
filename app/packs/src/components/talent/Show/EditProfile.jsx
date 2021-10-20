import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import About from "./edit_profile/About";
import Token from "./edit_profile/Token";
import Services from "./edit_profile/Services";
import Perks from "./edit_profile/Perks";
import CareerGoal from "./edit_profile/CareerGoal";
import Contacts from "./edit_profile/Contacts";
import Timeline from "./edit_profile/Timeline";

const EditProfile = ({ railsContext, ...props }) => {
  const [show, setShow] = useState(false);
  const [activeSection, setActiveSection] = useState("About");
  const allowEdit = props.allowEdit;

  return (
    <>
      {allowEdit && (
        <button
          onClick={() => setShow((prev) => !prev)}
          className="btn btn-outline-secondary talent-button border-0"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
      )}
      <Modal
        size="lg"
        scrollable={true}
        fullscreen={"md-down"}
        show={show}
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
                    activeSection == "Services" ? "text-primary" : ""
                  }`}
                  onClick={() => setActiveSection("Services")}
                >
                  Services
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
                  Career Goal
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
                />
              )}
              {activeSection == "Services" && (
                <Services close={() => setShow(false)} {...props} />
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

export default (props, railsContext) => {
  return <EditProfile {...props} railsContext={railsContext} />;
};
