import React from "react";
import { string, oneOf, bool, func } from "prop-types";
import P3 from "src/components/design_system/typography/p3";
import cx from "classnames";

const OptionalTag = ({ text, mode, onClick, closeable, bold }) => {
  return (
    <div className={cx("optional-tag-container", mode)}>
      <P3 bold={bold} className="text-black" mode={mode} text={text} />
      {closeable && (
        <span className={cx("close-tag", mode)} onClick={onClick}></span>
      )}
    </div>
  );
};

OptionalTag.defaultProps = {
  mode: "light",
  closeable: true,
  bold: null,
};

OptionalTag.propTypes = {
  text: string.isRequired,
  mode: oneOf(["light", "dark"]),
  onClick: func.isRequired,
  closeable: bool,
  bold: bool,
};

export default OptionalTag;
