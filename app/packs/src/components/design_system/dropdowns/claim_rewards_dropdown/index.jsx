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
        <P2 className="text-black" mode={mode} text={selectedItem} />
        <OrderBy
          black
          className="align-self-center"
          pathClassName={cx("icon-theme", mode)}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu className={cx("w-100", mode)}>
        <Dropdown.Item
          key="tab-dropdown-restake"
          onClick={(e) => setSelectedItem(e.target.innerText)}
        >
          <P3
            className="text-black"
            bold
            mode={mode}
            text={`Use my rewards to buy more $${talentSymbol}`}
          />
        </Dropdown.Item>
        <Dropdown.Item
          key="tab-dropdown-withdrawal"
          className="d-flex align-items-center"
          disabled
        >
          <P3
            className="text-primary-04"
            bold
            mode={mode}
            text="Claim Rewards to my wallet"
          />
          <Tag className="text-primary-04 ml-2 tag-inside-dropdown">
            <P3 className="text-primary-04" bold text="Coming Soon" />
          </Tag>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ClaimRewardsDropdown;
