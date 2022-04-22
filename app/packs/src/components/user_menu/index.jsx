import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import TalentProfilePicture from "../talent/TalentProfilePicture";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  SUPPORTER_GUIDE,
  TALENT_GUIDE,
  TERMS_HREF,
  PRIVACY_HREF,
} from "src/utils/constants";
import Button from "src/components/design_system/button";
import { P2, P3 } from "src/components/design_system/typography";
import { ArrowFill, Sun, Moon } from "src/components/icons";

const UserMenu = ({ user, toggleTheme, mode, onClickTransak, signOut }) => {
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
        <ArrowFill className="toggle-arrow" size={8} color="currentColor" />
      </Dropdown.Toggle>

      <Dropdown.Menu className="user-menu-dropdown">
        <Dropdown.Item
          key="tab-dropdown-my-profile"
          className="text-black user-menu-dropdown-item"
          href={`/u/${user.username}`}
        >
          <P3 bold text="My profile" className="text-black" />
        </Dropdown.Item>
        <Dropdown.Divider className="user-menu-divider mx-2 my-0" />
        <Dropdown.Item
          key="tab-dropdown-theme"
          className="text-black d-flex flex-row justify-content-between align-items-center user-menu-dropdown-item"
          onClick={toggleTheme}
        >
          <P3
            bold
            text={`${mode === "light" ? "Dark" : "Light"} mode`}
            className="text-black"
          />
          {mode == "light" ? (
            <Moon color="currentColor" />
          ) : (
            <Sun color="currentColor" />
          )}
        </Dropdown.Item>
        <Dropdown.Divider className="user-menu-divider mx-2 my-0" />
        <Dropdown.Item
          key="tab-dropdown-t-c"
          className="text-black d-flex flex-row justify-content-between user-menu-dropdown-item"
          onClick={() => window.open(TERMS_HREF, "_blank")}
        >
          <P3 bold text="Terms & Conditions" className="text-black" />
          <FontAwesomeIcon
            icon={faExternalLinkAlt}
            className="ml-2"
            size="sm"
          />
        </Dropdown.Item>
        <Dropdown.Item
          key="tab-dropdown-user-guide"
          className="text-black d-flex flex-row justify-content-between user-menu-dropdown-item"
          target="self"
          href={user.isTalent ? TALENT_GUIDE : SUPPORTER_GUIDE}
        >
          <P3 bold text="User guide" className="text-black" />
          <FontAwesomeIcon
            icon={faExternalLinkAlt}
            className="ml-2"
            size="sm"
          />
        </Dropdown.Item>
        <Dropdown.Item
          key="tab-dropdown-p-h"
          className="text-black d-flex flex-row justify-content-between user-menu-dropdown-item"
          onClick={() => window.open(PRIVACY_HREF, "_blank")}
        >
          <P3 bold text="Privacy Policy" className="text-black" />
          <FontAwesomeIcon
            icon={faExternalLinkAlt}
            className="ml-2"
            size="sm"
          />
        </Dropdown.Item>
        <Dropdown.Divider className="user-menu-divider mx-2 my-0" />
        <Dropdown.Item
          key="tab-dropdown-sign-out"
          onClick={signOut}
          className="text-black user-menu-dropdown-item"
        >
          <P3 bold text="Sign out" className="text-black" />
        </Dropdown.Item>
        <Button
          onClick={onClickInvites}
          type="primary-default"
          className="w-100 mb-2"
        >
          <P3 bold text="Invites" className="permanent-text-white" />
        </Button>
        <Button
          onClick={onClickTransak}
          type="primary-outline"
          className="w-100 mb-2"
        >
          <P3 bold text="Get funds" className="current-color" />
        </Button>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserMenu;
