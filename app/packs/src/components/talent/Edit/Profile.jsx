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
import P3 from "src/components/design_system/typography/p3";
import { Spinner, GreenCheck } from "src/components/icons";

import About from "./About";
import Highlights from "./Highlights";
import Goal from "./Goal";
import Token from "./Token";
import Perks from "./Perks";
import Settings from "./Settings";

const LoadingProfile = ({ show, setShow, mode, done }) => {
  return (
    <Modal
      show={show}
      centered
      onHide={() => setShow(false)}
      dialogClassName={"remove-background"}
      backdrop={false}
    >
      <Modal.Body className="d-flex flex-column justify-content-center align-items-center py-4">
        {done && (
          <div className="d-flex flex-column justify-conter-center align-items-center my-4">
            <P3 mode={mode} text="Profile updated" bold className="mb-3" />
            <GreenCheck />
          </div>
        )}
        {!done && (
          <div className="d-flex flex-column justify-conter-center align-items-center my-4">
            <P3
              mode={mode}
              text="We're updating your profile"
              bold
              className="mb-3"
            />
            <Spinner />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

const Profile = (props) => {
  const theme = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("About");
  const { height, width } = useWindowDimensionsHook();
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [finishedUpdating, setFinishedUpdating] = useState(true);
  const mobile = width < 992;
  const progress = profileProgress(props);
  const requiredFields = missingFields(props);
  const [sharedState, setSharedState] = useState({ ...props });

  console.log("--- ALL PROPS ---");
  console.log(props);

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
    setFinishedUpdating(false);
    setUpdatingProfile(true);

    const response = await patch(`/api/v1/talent/${props.talent.id}`, {
      talent: {
        public: !props.talent.public,
      },
    }).catch(() => {
      setFinishedUpdating(true);
      setUpdatingProfile(false);
    });

    if (response && response.error) {
      // setFinishedUpdating(true);
      setTimeout(() => setFinishedUpdating(true), 1000);
      setTimeout(() => setUpdatingProfile(false), 2000);
    }

    if (response && !response.error) {
      // setFinishedUpdating(true);
      setSharedState((prev) => ({
        ...prev,
        talent: { ...prev.talent, public: !props.talent.public },
      }));

      setTimeout(() => setFinishedUpdating(true), 1000);
      setTimeout(() => setUpdatingProfile(false), 2000);
    }
  };

  const saveAbout = async () => {
    setFinishedUpdating(false);
    setUpdatingProfile(true);
    const response = await patch(`/api/v1/talent/${props.talent.id}`, {
      ...sharedState,
    }).catch(() => {
      setError(true);
      setSaving(false);
    });

    setFinishedUpdating(true);
    setTimeout(() => setUpdatingProfile(false), 1000);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex flex-row w-100 justify-content-between text-primary edit-profile-talent-progress py-2 px-3">
        {/* below is required so the justify-content-between aligns properly */}
        <LoadingProfile
          show={updatingProfile}
          setShow={setUpdatingProfile}
          done={finishedUpdating}
        />
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
      <div className="talent-table-tabs w-100 horizontal-scroll mt-3 d-flex flex-row align-items-center">
        <div
          onClick={() => setActiveTab("About")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "About" ? " active-talent-table-tab" : ""
          }`}
        >
          About
        </div>
        <div
          onClick={() => setActiveTab("Highlights")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "Highlights" ? " active-talent-table-tab" : ""
          }`}
        >
          Highlights
        </div>
        <div
          onClick={() => setActiveTab("Goal")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "Goal" ? " active-talent-table-tab" : ""
          }`}
        >
          Goal
        </div>
        <div
          onClick={() => setActiveTab("Token")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "Token" ? " active-talent-table-tab" : ""
          }`}
        >
          Token
        </div>
        <div
          onClick={() => setActiveTab("Perks")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "Perks" ? " active-talent-table-tab" : ""
          }`}
        >
          Perks
        </div>
        <div
          onClick={() => setActiveTab("Settings")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "Settings" ? " active-talent-table-tab" : ""
          }`}
        >
          Settings
        </div>
        {!mobile && (
          <>
            <Button
              onClick={() => togglePublicProfile()}
              type={buttonType()}
              disabled={requiredFields.length > 0}
              mode={theme.mode()}
              className="ml-auto mr-3"
            >
              {sharedState.talent.public ? "Public" : "Publish Profile"}
            </Button>
          </>
        )}
      </div>
      <div className="d-flex flex-column align-items-center p-3 edit-profile-content w-100">
        {activeTab == "About" && (
          <About
            {...sharedState}
            mode={theme.mode()}
            mobile={mobile}
            changeTab={() => setActiveTab("Highlights")}
            changeSharedState={setSharedState}
            saveProfile={() => saveAbout()}
            publicButtonType={buttonType()}
            disablePublicButton={requiredFields.length > 0}
            togglePublicProfile={() => togglePublicProfile()}
          />
        )}
        {activeTab == "Highlights" && (
          <Highlights
            {...sharedState}
            mode={theme.mode()}
            mobile={mobile}
            changeTab={(tab) => setActiveTab(tab)}
            changeSharedState={setSharedState}
            publicButtonType={buttonType()}
            disablePublicButton={requiredFields.length > 0}
            togglePublicProfile={() => togglePublicProfile()}
          />
        )}
        {activeTab == "Goal" && (
          <Goal
            {...sharedState}
            mode={theme.mode()}
            mobile={mobile}
            changeTab={(tab) => setActiveTab(tab)}
            changeSharedState={setSharedState}
          />
        )}
        {activeTab == "Token" && (
          <Token
            {...sharedState}
            mode={theme.mode()}
            mobile={mobile}
            changeTab={(tab) => setActiveTab(tab)}
            changeSharedState={setSharedState}
          />
        )}
        {activeTab == "Perks" && (
          <Perks
            {...sharedState}
            mode={theme.mode()}
            mobile={mobile}
            changeTab={(tab) => setActiveTab(tab)}
            changeSharedState={setSharedState}
          />
        )}
        {activeTab == "Settings" && (
          <Settings
            {...sharedState}
            mode={theme.mode()}
            mobile={mobile}
            changeTab={(tab) => setActiveTab(tab)}
            changeSharedState={setSharedState}
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
