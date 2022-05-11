import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import P2 from "../../typography/p2";
import { OrderBy } from "src/components/icons";
import cx from "classnames";
import { Celo, Polygon } from "src/components/icons";

const ChainSelectionDropdown = ({
  className,
  mode,
  selectedNetwork,
  setSelectedNetwork,
}) => {
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
        <div className="d-flex flex-row align-items-center">
          {selectedNetwork == "Polygon" ? (
            <Polygon className="mr-2" />
          ) : (
            <Celo className="mr-2" />
          )}
          <P2 className="text-black" mode={mode} text={selectedNetwork} />
        </div>
        <OrderBy
          black
          className="align-self-center"
          pathClassName={cx("icon-theme", mode)}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu className={cx("w-100", mode)}>
        <Dropdown.Item
          key="tab-dropdown-restake"
          className="d-flex flex-row align-items-center"
          onClick={(e) => setSelectedNetwork(e.target.innerText)}
        >
          <Polygon className="mr-2" />
          <P2 className="text-black" bold mode={mode} text="Polygon" />
        </Dropdown.Item>
        <Dropdown.Item
          key="tab-dropdown-withdrawal"
          className="d-flex flex-row align-items-center"
          onClick={(e) => setSelectedNetwork(e.target.innerText)}
        >
          <Celo className="mr-2" />
          <P2 className="text-black" bold mode={mode} text="Celo" />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChainSelectionDropdown;
