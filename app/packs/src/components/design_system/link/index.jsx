import React from "react";
import cx from "classnames";
import { string, oneOf, bool, node } from "prop-types";

import Button from "src/components/design_system/button";
import { P2 } from "src/components/design_system/typography";

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
  if (!!onClick) {
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        className={cx(
          "link-container",
          "button-link",
          type,
          disabled && "disabled",
          className
        )}
      >
        {text && <P2 text={text} bold={bold} />}
        {children}
      </button>
    );
  }

  return (
    <a
      className={cx("link-container", type, disabled && "disabled", className)}
      href={href}
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
