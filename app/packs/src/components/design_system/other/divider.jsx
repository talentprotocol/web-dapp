import React from "react";
import cx from "classnames";

const Divider = ({ mode, className }) => {
  return <div className={cx("divider", mode, className)}></div>;
};

export default Divider;
