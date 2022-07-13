import React, { useState, useContext, useEffect } from "react";
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
import Invites from "./Invites";

import cx from "classnames";

const allowedTabs = [
  "About",
  "Highlights",
  "Goals",
  "Token",
  "Perks",
  "Settings",
  "Invites",
];

const IncompleteTabIndicator = () => {
  return (
    <div className="position-relative">
      <span
        className="position-absolute badge rounded-circle bg-danger p-1"
        style={{ height: 0, width: 0, right: -8, top: -23 }}
      >
        &nbsp;
      </span>
    </div>
  );
};

const Profile = (props) => {
  const theme = useContext(ThemeContext);
  const url = new URL(window.location);
  const searchParams = new URLSearchParams(url.search);
  const initialTab = () =>
    allowedTabs.find((item) => item === searchParams.get("tab")) || "About";
  const [activeTab, setActiveTab] = useState(initialTab());
  const { mobile } = useWindowDimensionsHook();
  const [saving, setSaving] = useState({
    loading: false,
    public: false,
  });
  const [tabHasChanges, setTabHasChanges] = useState(false);
  const [show, setShow] = useState(false);
  const [nextTab, setNextTab] = useState(null);
  const [sharedState, setSharedState] = useState({ ...props });
  const progress = profileProgress(sharedState);
  const requiredFields = missingFields(sharedState);

  useEffect(() => {
    if (activeTab != "") {
      window.history.pushState(
        {},
        document.title,
        `${url.pathname}?tab=${activeTab}`
      );
    }
  }, [activeTab]);

  const alertBarText = () => {
    switch (sharedState.user.profile_type) {
      case "applying":
        return "Complete your profile to apply for a Talent Token";
      case "waiting_for_approval":
        return "Pending Approval to launch your Talent Token";
      case "approved":
        return "Your profile has been approved! You can now launch your Talent Token";
      case "talent":
        return progress == 100
          ? "Your profile is complete!"
          : "Complete your profile to appeal to more supporters and earn rewards.";
      default:
        return "Complete your profile to apply for a Talent Token";
    }
  };

  const alertBarColor = () => {
    if (
      sharedState.user.profile_type == "applying" ||
      sharedState.user.profile_type == "talent"
    ) {
      return "primary";
    } else if (sharedState.user.profile_type == "waiting_for_approval") {
      return "yellow";
    } else if (sharedState.user.profile_type == "approved") {
      return "green";
    } else {
      return "primary";
    }
  };

  const buttonType = () => {
    if (requiredFields.length == 0) {
      if (sharedState.user.profile_type == "applying") {
        return "positive-default";
      } else if (sharedState.user.profile_type == "waiting_for_approval") {
        return "danger-outline";
      } else if (
        sharedState.user.profile_type == "approved" ||
        sharedState.user.profile_type == "talent"
      ) {
        return sharedState.talent.public ? "white-subtle" : "positive-default";
      } else {
        return "positive-default";
      }
    } else {
      return "positive-subtle";
    }
  };

  const buttonText = () => {
    switch (sharedState.user.profile_type) {
      case "applying":
        return "Send Profile for Approval";
      case "waiting_for_approval":
        return "Cancel Submission";
      case "approved":
      case "talent":
        return "N/A";
      default:
        return "Send Profile for Approval";
    }
  };

  const onProfileButtonClick = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));
    let params = {};
    if (sharedState.user.profile_type == "talent") {
      params = {
        talent: {
          public: !sharedState.talent.public,
        },
        user: { id: props.user.id },
      };
    } else {
      params = {
        user: {
          id: props.user.id,
          profile_type:
            sharedState.user.profile_type == "applying"
              ? "waiting_for_approval"
              : "applying",
        },
      };
    }

    const response = await patch(
      `/api/v1/talent/${props.talent.id}`,
      params
    ).catch(() => {
      return false;
    });

    if (response && !response.error) {
      setSharedState((prev) => ({
        ...prev,
        talent: { ...prev.talent, public: !response.public },
        user: { ...prev.user, profile_type: response.user.profile_type },
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

  const changeTabAndIgnoreChanges = (tab) => {
    setShow(false);
    setTabHasChanges(false);
    setActiveTab(tab);
  };

  return (
    <>
      <div className="edit-profile-fixed-bar">
        {progress != 100 && (
          <Tooltip
            body={`You are missing the following fields: ${requiredFields.join(
              ", "
            )}`}
            popOverAccessibilityId={"progressStats"}
            mode={theme.mode()}
            hide={requiredFields.length == 0}
          >
            <div
              className={`edit-profile-talent-progress-container-${alertBarColor()} py-2 px-3`}
            >
              <div className="d-flex flex-row w-100 justify-content-between edit-profile-talent-progress">
                {/* below is required so the justify-content-between aligns properly */}
                <P3 text="" />
                <P3
                  mode={theme.mode()}
                  text={alertBarText()}
                  bold
                  className="current-color"
                />
                <P3 mode={theme.mode()} className="current-color">
                  <strong>{progress}</strong>/100%
                </P3>
              </div>
            </div>
          </Tooltip>
        )}
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
                {requiredFields.some((f) =>
                  ["Occupation", "Bio", "Profile picture"].includes(f)
                ) && <IncompleteTabIndicator />}
              </div>
              <div
                onClick={() => changeTab("Highlights")}
                className={`talent-table-tab${
                  activeTab == "Highlights" ? " active-talent-table-tab" : ""
                }`}
              >
                Highlights
              </div>
              <div
                onClick={() => changeTab("Goals")}
                className={`talent-table-tab${
                  activeTab == "Goals" ? " active-talent-table-tab" : ""
                }`}
              >
                Goals
                {requiredFields.includes("Pitch") && <IncompleteTabIndicator />}
              </div>
              <div
                onClick={() => changeTab("Token")}
                className={`talent-table-tab${
                  activeTab == "Token" ? " active-talent-table-tab" : ""
                } ${
                  sharedState.user.profile_type !== "approved" &&
                  sharedState.user.profile_type !== "talent" &&
                  "disabled-talent-table-tab"
                }`}
              >
                Token
                {sharedState.user.profile_type === "approved" &&
                  sharedState.user.profile_type === "talent" &&
                  requiredFields.includes("Ticker") && (
                    <IncompleteTabIndicator />
                  )}
              </div>
              <div
                onClick={() => changeTab("Perks")}
                className={`talent-table-tab${
                  activeTab == "Perks" ? " active-talent-table-tab" : ""
                } ${
                  sharedState.user.profile_type !== "approved" &&
                  sharedState.user.profile_type !== "talent" &&
                  "disabled-talent-table-tab"
                }`}
              >
                Perks
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
            {!mobile && buttonText() != "N/A" && (
              <>
                <LoadingButton
                  onClick={() => onProfileButtonClick()}
                  type={buttonType()}
                  disabled={requiredFields.length > 0 || saving["loading"]}
                  mode={theme.mode()}
                  loading={saving["loading"]}
                >
                  {buttonText()}
                </LoadingButton>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className="d-flex flex-column align-items-center"
        style={{ marginTop: 130 }}
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
              <P2
                mode={theme.mode()}
                text="You still have unsaved changes, are you sure you want to go to a different tab without saving them?"
              />
              <div className="d-flex flex-row justify-content-end mt-3">
                <Button
                  onClick={() => setShow(false)}
                  type="white-subtle"
                  mode={theme.mode()}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => changeTabAndIgnoreChanges(nextTab)}
                  type="primary-default"
                  mode={theme.mode()}
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
              mode={theme.mode()}
              mobile={mobile}
              changeTab={() => changeTab("Highlights")}
              changeSharedState={setSharedState}
              saveProfile={() => saveAbout()}
              publicButtonType={buttonType()}
              disablePublicButton={requiredFields.length > 0}
              onProfileButtonClick={() => onProfileButtonClick()}
              trackChanges={setTabHasChanges}
              buttonText={buttonText()}
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
              onProfileButtonClick={() => onProfileButtonClick()}
              trackChanges={setTabHasChanges}
              buttonText={buttonText()}
            />
          )}
          {activeTab == "Goals" && (
            <Goal
              {...sharedState}
              mode={theme.mode()}
              mobile={mobile}
              changeTab={(tab) => changeTab(tab)}
              changeSharedState={setSharedState}
              publicButtonType={buttonType()}
              disablePublicButton={requiredFields.length > 0}
              onProfileButtonClick={() => onProfileButtonClick()}
              trackChanges={setTabHasChanges}
              buttonText={buttonText()}
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
              onProfileButtonClick={() => onProfileButtonClick()}
              trackChanges={setTabHasChanges}
              buttonText={buttonText()}
              requiredFields={requiredFields}
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
              onProfileButtonClick={() => onProfileButtonClick()}
              trackChanges={setTabHasChanges}
              buttonText={buttonText()}
            />
          )}
          {activeTab == "Invites" && (
            <Invites
              {...sharedState}
              mode={theme.mode()}
              mobile={mobile}
              changeTab={(tab) => changeTab(tab)}
              publicButtonType={buttonType()}
              disablePublicButton={requiredFields.length > 0}
              onProfileButtonClick={() => onProfileButtonClick()}
              trackChanges={setTabHasChanges}
              buttonText={buttonText()}
              invites={props.invites}
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
              onProfileButtonClick={() => onProfileButtonClick()}
              trackChanges={setTabHasChanges}
              buttonText={buttonText()}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer>
      <Profile {...props} railsContext={railsContext} />
    </ThemeContainer>
  );
};
