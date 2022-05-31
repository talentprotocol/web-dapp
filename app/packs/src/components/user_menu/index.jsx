import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import TalentProfilePicture from "../talent/TalentProfilePicture";
import Button from "src/components/design_system/button";
import { H5, P2 } from "src/components/design_system/typography";
import Modal from "react-bootstrap/Modal";
import { patch } from "src/utils/requests";
import {
  Alert,
  ArrowFill,
  User,
  Edit,
  Settings,
  SignOut,
  Sun,
  Moon,
} from "src/components/icons";

export const ApplyToLaunchTokenModal = ({ show, hide, user }) => {
  const upgradeToTalent = async () => {
    const response = await patch(
      `/api/v1/supporters/${user.investorId}/upgrade_profile_to_talent`
    )
      .then(() => window.location.replace(`/u/${user.username}/edit_profile`))
      .catch(() => setLoading(false));

    if (response.users) {
      setUsers(response.users);
    }
  };

  return (
    <Modal
      show={show}
      onHide={hide}
      centered
      dialogClassName="remove-background"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center p-4">
        <Alert width={40} height={40} />
        <H5
          className="text-black mt-4 mb-1"
          bold
          text="Apply to launch your Talent Token"
        />
        <P2
          className="text-primary-03 text-center"
          text="Launching your token requires an application and validation by the community.
            It's important that all talents are a good fit with the platform and motivated to participate.
            By clicking “Let's do this” your profile will have additional information you'll need to fill out to apply."
        />
        <div className="d-flex mt-6 w-100">
          <Button
            className="mr-2 w-100"
            onClick={hide}
            text="Cancel"
            type="white-subtle"
            size="big"
          />
          <Button
            className="w-100"
            onClick={upgradeToTalent}
            text="Let's do this!"
            type="primary-default"
            size="big"
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

const UserMenu = ({ user, toggleTheme, mode, onClickTransak, signOut }) => {
  const [showApplyToLaunchTokenModal, setShowApplyToLaunchTokenModal] =
    useState(false);

  const onClickInvites = () => {
    const url = `/u/${user.username}/edit_profile?tab=Invites`;

    window.location.href = url;
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        className="talent-button white-subtle-button normal-size-button no-caret d-flex align-items-center text-primary-03"
        id="user-dropdown"
        bsPrefix=""
        as="div"
        style={{ height: 34 }}
      >
        <TalentProfilePicture
          src={user.profilePictureUrl}
          height={20}
          className="mr-2"
        />
        <ArrowFill
          className="toggle-arrow"
          size={8}
          pathClassName="text-primary-04"
          color="currentColor"
        />
      </Dropdown.Toggle>

      <Dropdown.Menu className="user-menu-dropdown">
        <Dropdown.Item
          key="tab-dropdown-my-profile"
          className="text-black d-flex flex-row align-items-center user-menu-dropdown-item"
          href={`/u/${user.username}`}
        >
          <User pathClassName="icon-dropdown-item" />
          <P2 bold text="My profile" className="text-black ml-3" />
        </Dropdown.Item>
        <Dropdown.Item
          key="tab-dropdown-edit-profile"
          className="text-black d-flex flex-row align-items-center user-menu-dropdown-item"
          href={`/u/${user.username}/edit_profile`}
        >
          <Edit pathClassName="icon-dropdown-item" />
          <P2 bold text="Edit Profile" className="text-black ml-3" />
        </Dropdown.Item>
        <Dropdown.Item
          key="tab-dropdown-settings"
          className="text-black d-flex flex-row align-items-center user-menu-dropdown-item"
          href={`/u/${user.username}/edit_profile?tab=Settings`}
        >
          <Settings pathClassName="icon-dropdown-item" />
          <P2 bold text="Settings" className="text-black ml-3" />
        </Dropdown.Item>
        <Dropdown.Divider className="menu-divider mx-2 my-2" />
        <Dropdown.Item
          key="tab-dropdown-theme"
          className="text-black d-flex flex-row align-items-center user-menu-dropdown-item"
          onClick={toggleTheme}
        >
          {mode == "light" ? (
            <Moon pathClassName="icon-dropdown-item" color="currentColor" />
          ) : (
            <Sun pathClassName="icon-dropdown-item" color="currentColor" />
          )}
          <P2
            bold
            text={`Dark Theme: ${mode === "light" ? "Off" : "On"}`}
            className="text-black ml-3"
          />
        </Dropdown.Item>
        <Dropdown.Divider className="menu-divider mx-2 my-2" />
        <Dropdown.Item
          key="tab-dropdown-sign-out"
          onClick={signOut}
          className="text-black d-flex flex-row align-items-center user-menu-dropdown-item"
        >
          <SignOut pathClassName="icon-dropdown-item" />
          <P2 bold text="Sign out" className="text-black ml-3" />
        </Dropdown.Item>
        <Dropdown.Divider className="menu-divider mx-2 my-2" />
        {user.isTalent ? (
          <Button
            onClick={onClickInvites}
            type="primary-default"
            size="big"
            className="w-100 mb-2"
          >
            <P2 bold text="Invites" className="permanent-text-white" />
          </Button>
        ) : (
          <Button
            onClick={() => setShowApplyToLaunchTokenModal(true)}
            type="primary-default"
            size="big"
            className="w-100 mb-2"
          >
            <P2
              bold
              text="Apply to Launch Token"
              className="permanent-text-white"
            />
          </Button>
        )}
        <Button
          onClick={onClickTransak}
          type="primary-outline"
          size="big"
          className="w-100 mb-2"
        >
          <P2 bold text="Get funds" className="current-color" />
        </Button>
      </Dropdown.Menu>
      <ApplyToLaunchTokenModal
        show={showApplyToLaunchTokenModal}
        hide={() => setShowApplyToLaunchTokenModal(false)}
        user={user}
      />
    </Dropdown>
  );
};

export default UserMenu;
