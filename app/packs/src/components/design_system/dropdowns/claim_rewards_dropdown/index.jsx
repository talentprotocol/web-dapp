import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import P2 from "../../typography/p2";
import P3 from "../../typography/p3";
import Tag from "../../tag";
import { OrderBy } from "src/components/icons";
import cx from "classnames";

const ClaimRewardsDropdown = ({ className, mode, talentSymbol }) => {
  const [selectedItem, setSelectedItem] = useState(
    `Use my rewards to buy more $${talentSymbol}`
  );

  return (
    <Dropdown>
      <Dropdown.Toggle
        className={cx(
          "claim-rewards-dropdown-btn",
          "no-caret",
          "w-100",
          "d-flex",
          "justify-content-between",
          mode,
          className
        )}
        id="claim-methods-dropdown"
      >
        <P2 className="text-black" text={selectedItem} />
        <OrderBy
          black
          className="align-self-center"
          pathClassName={cx("icon-theme", mode)}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu className={cx("user-menu-dropdown", "w-100", mode)}>
        <Dropdown.Item
          key="tab-dropdown-restake"
          onClick={(e) => setSelectedItem(e.target.innerText)}
          className="user-menu-dropdown-item"
        >
          <P3
            className="text-black"
            bold
            text={`Use my rewards to buy more $${talentSymbol}`}
          />
        </Dropdown.Item>
        <Dropdown.Item
          key="tab-dropdown-withdrawal"
          className="d-flex align-items-center user-menu-dropdown-item"
          disabled
        >
          <P3
            className="text-description"
            bold
            text="Claim Rewards to my wallet"
          />
          <Tag
            className="text-description ml-2 tag-inside-dropdown"
            mode={mode}
          >
            <P3 className="text-description" bold text="Coming Soon" />
          </Tag>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ClaimRewardsDropdown;
