import React from "react";
import { string, oneOf, bool, func, node } from "prop-types";
import P3 from "src/components/design_system/typography/p3";
import cx from "classnames";

const Link = ({ Icon, text, mode, active, onClick, href }) => {
  return (
    <div className="link-container" onClick={onClick} href={href}>
      <Icon pathClassName={cx("link-icon", mode, active ? "active" : "")} />
      {text && (
        <P3
          className={cx("link-text", mode, active ? "active" : "")}
          text={text}
          bold={active}
        />
      )}
    </div>
  );
};

Link.defaultProps = {
  Icon: null,
  text: null,
  mode: "light",
  active: false,
  onClick: null,
  href: null,
};

Link.propTypes = {
  Icon: node,
  text: string,
  mode: oneOf(["light", "dark"]),
  active: bool,
  onClick: func,
  href: string,
};

export default Link;
