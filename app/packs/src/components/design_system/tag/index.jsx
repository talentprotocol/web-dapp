import React from "react";
import { string, oneOf, node } from "prop-types";
import P2 from "src/components/design_system/typography/p2";
import P3 from "src/components/design_system/typography/p3";
import cx from "classnames";

const Tag = ({ text, mode, size, children }) => {
  return (
    <div className={cx("tag-container", mode)}>
      {text && (
        <>
          {size === "normal" && <P2 mode={mode} text={text} />}
          {size === "small" && <P3 mode={mode} text={text} />}
        </>
      )}
      {children}
    </div>
  );
};

Tag.defaultProps = {
  text: null,
  mode: "light",
  size: "normal",
  children: null,
};

Tag.propTypes = {
  text: string,
  mode: oneOf(["light", "dark"]),
  size: string,
  children: node,
};

export default Tag;
