import React from "react";
import { string, oneOf, node } from "prop-types";
import P2 from "src/components/design_system/typography/p2";
import P3 from "src/components/design_system/typography/p3";
import cx from "classnames";

const Tag = ({ text, size, children, className }) => {
  return (
    <div className={cx("tag-container", className)}>
      {text && (
        <>
          {size === "normal" && <P2 text={text} />}
          {size === "small" && <P3 text={text} />}
        </>
      )}
      {children}
    </div>
  );
};

Tag.defaultProps = {
  text: null,
  size: "normal",
  children: null,
};

Tag.propTypes = {
  text: string,
  size: string,
  children: node,
};

export default Tag;
