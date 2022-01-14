import React from "react";
import { string, oneOf, bool, func, node } from "prop-types";
import P2 from "src/components/design_system/typography/p2";
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
}) => {
  return (
    <a
      className={cx("link-container", disabled && "disabled", className)}
      href={href}
      target={target}
    >
      {Icon && <Icon pathClassName={cx("link-icon", bold && "bold")} />}
      {text && (
        <P2
          className={cx("link-text", type, bold && "bold")}
          text={text}
          bold={bold}
        />
      )}
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
};

export default Link;
