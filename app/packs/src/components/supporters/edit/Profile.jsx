import React, { useState, useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

import { useWindowDimensionsHook } from "src/utils/window";

import Button from "src/components/design_system/button";
import { P2 } from "src/components/design_system/typography";
import ApplyToLaunchTokenModal from "src/components/design_system/modals/ApplyToLaunchTokenModal";

import About from "./About";
import Settings from "./Settings";
import Invites from "./Invites";

import cx from "classnames";

const allowedTabs = ["About", "Settings", "Invites"];

const Profile = (props) => {
  const url = new URL(window.location);
  const searchParams = new URLSearchParams(url.search);
  const initialTab = () =>
    allowedTabs.find((item) => item === searchParams.get("tab")) || "About";
  const [activeTab, setActiveTab] = useState(initialTab());
  const { mobile } = useWindowDimensionsHook();
  const [tabHasChanges, setTabHasChanges] = useState(false);
  const [show, setShow] = useState(false);
  const [nextTab, setNextTab] = useState(null);
  const [sharedState, setSharedState] = useState({
    ...props,
    currentPassword: "",
    newPassword: "",
    deletePassword: "",
    railsContext: null,
  });
  const [showApplyToLaunchTokenModal, setShowApplyToLaunchTokenModal] =
    useState(false);

  useEffect(() => {
    if (activeTab != "") {
      window.history.pushState(
        {},
        document.title,
        `${url.pathname}?tab=${activeTab}`
      );
    }
  }, [activeTab]);

  const changeTab = (tab) => {
    if (tabHasChanges) {
      setNextTab(tab);
      setShow(true);
    } else {
      setActiveTab(tab);
    }
  };

  const changeTabAndIgnoreChanges = (tab) => {
    setShow(false);
    setTabHasChanges(false);
    setActiveTab(tab);
  };

  return (
    <>
      <div className="edit-profile-fixed-bar">
        <div className="talent-table-tabs w-100 horizontal-scroll hide-scrollbar">
          <div
            className={cx(
              "edit-profile-talent-progress d-flex flex-row align-items-center justify-content-between",
              mobile && "pl-4"
            )}
          >
            <div className="d-flex mt-3">
              <div
                onClick={() => changeTab("About")}
                className={`talent-table-tab${
                  activeTab == "About" ? " active-talent-table-tab" : ""
                }`}
              >
                About
              </div>
              <div
                onClick={() => changeTab("Invites")}
                className={`talent-table-tab${
                  activeTab == "Invites" ? " active-talent-table-tab" : ""
                }`}
              >
                Invites
              </div>
              <div
                onClick={() => changeTab("Settings")}
                className={`talent-table-tab${
                  activeTab == "Settings" ? " active-talent-table-tab" : ""
                }`}
              >
                Settings
              </div>
            </div>
            {!mobile && (
              <Button
                onClick={() => setShowApplyToLaunchTokenModal(true)}
                type="primary-default"
                text="Apply to Launch Token"
              />
            )}
          </div>
        </div>
      </div>
      <div
        className="d-flex flex-column align-items-center"
        style={{ marginTop: 100 }}
      >
        <Modal
          show={show}
          onHide={() => setShow(false)}
          centered
          dialogClassName="remove-background"
        >
          <Modal.Header closeButton>
            <Modal.Title>You have unsaved changes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-column">
              <P2 text="You still have unsaved changes, are you sure you want to go to a different tab without saving them?" />
              <div className="d-flex flex-row justify-content-end mt-3">
                <Button
                  onClick={() => setShow(false)}
                  type="white-subtle"
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => changeTabAndIgnoreChanges(nextTab)}
                  type="primary-default"
                >
                  Go to {nextTab}
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <div className="d-flex flex-column edit-profile-content w-100">
          {activeTab == "About" && (
            <About
              {...sharedState}
              mobile={mobile}
              changeTab={(tab) => changeTab(tab)}
              changeSharedState={setSharedState}
              trackChanges={setTabHasChanges}
              setShowApplyToLaunchTokenModal={setShowApplyToLaunchTokenModal}
            />
          )}
          {activeTab == "Invites" && (
            <Invites
              mobile={mobile}
              changeTab={(tab) => changeTab(tab)}
              invites={sharedState.invites}
              setShowApplyToLaunchTokenModal={setShowApplyToLaunchTokenModal}
            />
          )}
          {activeTab == "Settings" && (
            <Settings
              {...sharedState}
              mobile={mobile}
              changeTab={(tab) => changeTab(tab)}
              changeSharedState={setSharedState}
              trackChanges={setTabHasChanges}
              setShowApplyToLaunchTokenModal={setShowApplyToLaunchTokenModal}
            />
          )}
        </div>
      </div>
      <ApplyToLaunchTokenModal
        show={showApplyToLaunchTokenModal}
        hide={() => setShowApplyToLaunchTokenModal(false)}
        investorId={props.investor.id}
        username={props.username}
      />
    </>
  );
};

export default (props, railsContext) => {
  return () => <Profile {...props} railsContext={railsContext} />;
};
