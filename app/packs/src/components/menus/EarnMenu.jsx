import React, { useEffect } from "react";

import { urlStore } from "src/contexts/state";

import Dropdown from "react-bootstrap/Dropdown";
import { P2, P3 } from "src/components/design_system/typography";
import Tag from "src/components/design_system/tag";
import { ArrowFill, Rocket, Invite, Quest } from "src/components/icons";

import cx from "classnames";

const EarnMenu = () => {
  const url = urlStore((state) => state.url);
  const changeURL = urlStore((state) => state.changeURL);

  const active = window.location.pathname === "/earn";

  useEffect(() => {
    changeURL(new URL(document.location));
  }, [window.location]);

  return (
    <Dropdown>
      <Dropdown.Toggle
        className={cx("no-caret d-flex align-items-center", "text-primary-03")}
        id="earn-dropdown"
        bsPrefix=""
        as="div"
        style={{ height: 34 }}
      >
        <P2
          className={cx("mr-2", active ? "text-black" : "text-primary-03")}
          bold
          text="Earn"
        />
        <ArrowFill className="toggle-arrow" size={8} color="currentColor" />
      </Dropdown.Toggle>

      <Dropdown.Menu className="user-menu-dropdown">
        <Dropdown.Item
          key="races-dropdown-theme"
          className="text-black d-flex flex-row align-items-center user-menu-dropdown-item"
          href="/earn?tab=race"
        >
          <Rocket
            color={`${url.search === "?tab=race" ? "#7A55FF" : "currentColor"}`}
          />
          <P2 bold text="Referral Race" className="text-black ml-2" />
        </Dropdown.Item>
        <Dropdown.Item
          key="invites-dropdown-theme"
          className="text-black d-flex flex-row align-items-center user-menu-dropdown-item"
          href="/earn?tab=talent"
        >
          <Invite
            color={`${
              url.search === "?tab=talent" ? "#7A55FF" : "currentColor"
            }`}
          />
          <P2 bold text="Talent Invites" className="text-black ml-2" />
        </Dropdown.Item>
        <Dropdown.Item
          key="quests-dropdown-theme"
          className="text-black d-flex flex-row align-items-center user-menu-dropdown-item"
          href="/earn?tab=quests"
        >
          <Quest
            color={`${
              url.search === "?tab=quests" ? "#7A55FF" : "currentColor"
            }`}
          />
          <P2 bold text="Quests" className="text-black mx-2" />
          <Tag className="bg-primary permanent-text-white cursor-pointer">
            <P3 className="current-color" bold text="New" />
          </Tag>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default EarnMenu;
