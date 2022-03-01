import React from "react";
import { string, oneOf, bool, node } from "prop-types";

import { P2 } from "src/components/design_system/typography";

import cx from "classnames";

const Link = ({
  text,
  type,
  disabled,
  bold,
  href,
  target,
  className,
  children,
  onClick,
}) => {
  let forceDisable = disabled;
  let onClickCallback = onClick;
  if (onClickCallback) {
    forceDisable = true;
  } else {
    onClickCallback = () => null;
  }

  return (
    <a
      className={cx("link-container", type, disabled && "disabled", className)}
      href={disabled ? null : href}
      disabled={disabled}
      target={target}
    >
      {text && <P2 text={text} bold={bold} />}
      {children}
    </a>
  );
};

Link.defaultProps = {
  text: null,
  type: "primary",
  disabled: false,
  bold: false,
  href: null,
  target: null,
  className: "",
  children: null,
};

Link.propTypes = {
  text: string,
  type: oneOf(["primary", "white"]),
  disabled: bool,
  bold: bool,
  href: string,
  target: string,
  className: string,
  children: node,
};

export default Link;
