import React from "react";
import { string, oneOf, bool, func, node } from "prop-types";

import { P2 } from "src/components/design_system/typography";

import cx from "classnames";

const Tab = ({
  Icon,
  text,
  type,
  onClick,
  href,
  target,
  className,
  children,
  active,
  disabled,
}) => {
  if (!!onClick) {
    return (
      <button
        className={cx(
          "tab-container",
          "button-link",
          type,
          active && "active",
          className
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {Icon && <Icon pathClassName="tab-icon" color="current-color" />}
        {text && (
          <P2 className={cx("tab-text", "current-color")} text={text} bold />
        )}
        {children}
      </button>
    );
  }

  return (
    <a
      className={cx(
        "tab-container",
        "button-link",
        type,
        active && "active",
        className
      )}
      href={disabled ? null : href}
      target={target}
    >
      {Icon && <Icon pathClassName="tab-icon" color="current-color" />}
      {text && (
        <P2 className={cx("tab-text", "current-color")} text={text} bold />
      )}
      {children}
    </a>
  );
};

Tab.defaultProps = {
  Icon: null,
  text: null,
  type: "primary",
  onClick: null,
  href: null,
  target: null,
  className: "",
  children: null,
  active: false,
  disabled: false,
};

Tab.propTypes = {
  Icon: node,
  text: string,
  type: oneOf(["primary", "white"]),
  onClick: func,
  href: string,
  target: string,
  className: string,
  children: node,
  active: bool,
  disabled: bool,
};

export default Tab;
