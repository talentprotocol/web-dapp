import React from "react";
import cx from "classnames";
import { string, bool, node } from "prop-types";

const ParagraphLink = ({
  text,
  disabled,
  bold,
  href,
  target,
  className,
  children,
}) => {
  return (
    <a
      className={cx(
        "paragraph-link",
        disabled && "disabled",
        text && "p2",
        bold && "bold",
        className
      )}
      href={disabled ? null : href}
      target={target}
    >
      {text}
      {children}
    </a>
  );
};

ParagraphLink.defaultProps = {
  text: null,
  disabled: false,
  bold: false,
  href: null,
  target: null,
  className: "",
  children: null,
};

ParagraphLink.propTypes = {
  text: string,
  disabled: bool,
  bold: bool,
  href: string,
  target: string,
  className: string,
  children: node,
};

export default ParagraphLink;
