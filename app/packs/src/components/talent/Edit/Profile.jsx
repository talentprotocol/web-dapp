import React, { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";

import { patch } from "src/utils/requests";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";
import { useWindowDimensionsHook } from "src/utils/window";
import {
  profileProgress,
  missingFields,
} from "src/components/talent/utils/talent";

import Button from "src/components/design_system/button";
import P2 from "src/components/design_system/typography/p2";
import P3 from "src/components/design_system/typography/p3";
import LoadingButton from "src/components/button/LoadingButton";
import Tooltip from "src/components/design_system/tooltip";

import About from "./About";
import Highlights from "./Highlights";
import Goal from "./Goal";
import Token from "./Token";
import Perks from "./Perks";
import Settings from "./Settings";

const Profile = (props) => {
  const theme = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("About");
  const { mobile } = useWindowDimensionsHook();
  const [saving, setSaving] = useState({
    loading: false,
    public: false,
  });
  const [tabHasChanges, setTabHasChanges] = useState(false);
  const [show, setShow] = useState(false);
  const [nextTab, setNextTab] = useState(null);
  const mobile = width < 992;
  const [sharedState, setSharedState] = useState({ ...props });
  const progress = profileProgress(sharedState);
  const requiredFields = missingFields(sharedState);

  const buttonType = () => {
    if (requiredFields.length == 0) {
      if (sharedState.talent.public) {
        return "positive-outline";
      } else {
        return "positive-default";
      }
    } else {
      return "white-subtle";
    }
  };

  const togglePublicProfile = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));
    const response = await patch(`/api/v1/talent/${props.talent.id}`, {
      talent: {
        public: !sharedState.talent.public,
      },
      user: { id: props.user.id },
    }).catch(() => {
      return false;
    });

    if (response && !response.error) {
      setSharedState((prev) => ({
        ...prev,
        talent: { ...prev.talent, public: !prev.talent.public },
      }));
      setSaving((prev) => ({ ...prev, loading: false, public: true }));

      return true;
    }
    setSaving((prev) => ({ ...prev, loading: false }));
  };

  const saveAbout = async () => {
    const response = await patch(`/api/v1/talent/${props.talent.id}`, {
      ...sharedState,
    }).catch(() => {
      return false;
    });

    return response;
  };

  const changeTab = (tab) => {
    if (tabHasChanges) {
      setNextTab(tab);
      setShow(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
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
            <P2
              mode={theme.mode()}
              text="You still have unsaved changes, are you sure you want to dismiss them?"
            />
            <div className="d-flex flex-row justify-content-end">
              <Button
                onClick={() => setShow(false)}
                type="white-subtle"
                mode={theme.mode()}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setActiveTab(nextTab)}
                type="primary-default"
                mode={theme.mode()}
              >
                Go to {nextTab}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Tooltip
        body={`You are missing the following fields: ${requiredFields.join(
          ", "
        )}`}
        popOverAccessibilityId={"progressStats"}
        mode={theme.mode()}
        hide={requiredFields.length == 0}
      >
        <div className="d-flex flex-row w-100 justify-content-between text-primary edit-profile-talent-progress py-2 px-3">
          {/* below is required so the justify-content-between aligns properly */}
          <P3 text="" />
          <P3
            mode={theme.mode()}
            text={
              progress == 100
                ? "Your profile is complete!"
                : "Complete your profile to appeal to more supporters and earn rewards."
            }
            bold
            className="text-primary"
          />
          <P3 mode={theme.mode()} className="text-primary">
            <strong>{progress}</strong>/100%
          </P3>
        </div>
      </Tooltip>
      <div className="talent-table-tabs w-100 horizontal-scroll mt-3 d-flex flex-row align-items-center">
        <div
          onClick={() => changeTab("About")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "About" ? " active-talent-table-tab" : ""
          }`}
        >
          About
        </div>
        <div
          onClick={() => changeTab("Highlights")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "Highlights" ? " active-talent-table-tab" : ""
          }`}
        >
          Highlights
        </div>
        <div
          onClick={() => changeTab("Goal")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "Goal" ? " active-talent-table-tab" : ""
          }`}
        >
          Goal
        </div>
        <div
          onClick={() => changeTab("Token")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "Token" ? " active-talent-table-tab" : ""
          }`}
        >
          Token
        </div>
        <div
          onClick={() => changeTab("Perks")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "Perks" ? " active-talent-table-tab" : ""
          }`}
        >
          Perks
        </div>
        <div
          onClick={() => changeTab("Settings")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "Settings" ? " active-talent-table-tab" : ""
          }`}
        >
          Settings
        </div>
        {!mobile && (
          <>
            <LoadingButton
              onClick={() => togglePublicProfile()}
              type={buttonType()}
              disabled={requiredFields.length > 0 || saving["loading"]}
              mode={theme.mode()}
              className="ml-auto mr-3"
              loading={saving["loading"]}
              success={saving["public"]}
            >
              {sharedState.talent.public ? "Public" : "Publish Profile"}
            </LoadingButton>
          </>
        )}
      </div>
      <div className="d-flex flex-column align-items-center p-3 edit-profile-content w-100">
        {activeTab == "About" && (
          <About
            {...sharedState}
            mode={theme.mode()}
            mobile={mobile}
            changeTab={() => changeTab("Highlights")}
            changeSharedState={setSharedState}
            saveProfile={() => saveAbout()}
            publicButtonType={buttonType()}
            disablePublicButton={requiredFields.length > 0}
            togglePublicProfile={() => togglePublicProfile()}
            trackChanges={setTabHasChanges}
          />
        )}
        {activeTab == "Highlights" && (
          <Highlights
            {...sharedState}
            mode={theme.mode()}
            mobile={mobile}
            changeTab={(tab) => changeTab(tab)}
            changeSharedState={setSharedState}
            publicButtonType={buttonType()}
            disablePublicButton={requiredFields.length > 0}
            togglePublicProfile={() => togglePublicProfile()}
            trackChanges={setTabHasChanges}
          />
        )}
        {activeTab == "Goal" && (
          <Goal
            {...sharedState}
            mode={theme.mode()}
            mobile={mobile}
            changeTab={(tab) => changeTab(tab)}
            changeSharedState={setSharedState}
            publicButtonType={buttonType()}
            disablePublicButton={requiredFields.length > 0}
            togglePublicProfile={() => togglePublicProfile()}
            trackChanges={setTabHasChanges}
          />
        )}
        {activeTab == "Token" && (
          <Token
            {...sharedState}
            mode={theme.mode()}
            mobile={mobile}
            changeTab={(tab) => changeTab(tab)}
            changeSharedState={setSharedState}
            publicButtonType={buttonType()}
            disablePublicButton={requiredFields.length > 0}
            togglePublicProfile={() => togglePublicProfile()}
            trackChanges={setTabHasChanges}
          />
        )}
        {activeTab == "Perks" && (
          <Perks
            {...sharedState}
            mode={theme.mode()}
            mobile={mobile}
            changeTab={(tab) => changeTab(tab)}
            changeSharedState={setSharedState}
            publicButtonType={buttonType()}
            disablePublicButton={requiredFields.length > 0}
            togglePublicProfile={() => togglePublicProfile()}
            trackChanges={setTabHasChanges}
          />
        )}
        {activeTab == "Settings" && (
          <Settings
            {...sharedState}
            mode={theme.mode()}
            mobile={mobile}
            changeTab={(tab) => changeTab(tab)}
            changeSharedState={setSharedState}
            publicButtonType={buttonType()}
            disablePublicButton={requiredFields.length > 0}
            togglePublicProfile={() => togglePublicProfile()}
            trackChanges={setTabHasChanges}
          />
        )}
      </div>
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer>
      <Profile {...props} railsContext={railsContext} />
    </ThemeContainer>
  );
};
