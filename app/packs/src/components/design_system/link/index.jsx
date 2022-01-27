import React from "react";
import { string, oneOf, bool, node } from "prop-types";

import { P2 } from "src/components/design_system/typography";

import cx from "classnames";

const Link = ({
  Icon,
  text,
  type,
  disabled,
  bold,
  href,
  target,
  className,
  children,
}) => {
  return (
    <a
      className={cx("link-container", disabled && "disabled", className)}
      href={disabled ? null : href}
      target={target}
    >
      {Icon && <Icon pathClassName={cx("link-icon", bold && "bold")} />}
      {text && <P2 className={cx("link-text", type)} text={text} bold={bold} />}
      {children}
    </a>
  );
};

Link.defaultProps = {
  Icon: null,
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
  Icon: node,
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
