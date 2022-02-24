import React, { useState } from "react";
import { string, bool, func, node } from "prop-types";

import { P2 } from "src/components/design_system/typography";

import cx from "classnames";

const TabButton = ({
  textTabPrimary,
  textTabSecondary,
  onClick,
  className,
}) => {
  const [activeTab, setActiveTab] = useState(textTabPrimary);

  const changeActiveTab = (tab) => {
    setActiveTab(tab);
    onClick(tab);
  };

  return (
    <div className="tab-button-container d-flex">
      <button
        className={cx(
          "button-link m-1",
          activeTab === textTabPrimary && "active text-white",
          className
        )}
        onClick={() => changeActiveTab(textTabPrimary)}
      >
        {textTabPrimary && (
          <P2 className="tab-text" text={textTabPrimary} bold />
        )}
      </button>
      <button
        className={cx(
          "button-link m-1",
          activeTab === textTabSecondary
            ? "active text-white"
            : "text-primary-03",
          className
        )}
        onClick={() => changeActiveTab(textTabSecondary)}
      >
        {textTabSecondary && (
          <P2 className="tab-text" text={textTabSecondary} bold />
        )}
      </button>
    </div>
  );
};

TabButton.defaultProps = {
  textTabPrimary: null,
  textTabSecondary: null,
  onClick: null,
  className: "",
  active: false,
};

TabButton.propTypes = {
  textTabPrimary: string,
  textTabSecondary: string,
  onClick: func,
  className: string,
  active: bool,
};

export default TabButton;
