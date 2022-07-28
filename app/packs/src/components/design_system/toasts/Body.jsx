import React from "react";
import { P1, P2 } from "src/components/design_system/typography";
import cx from "classnames";

const ToastBody = ({ heading, body, link, mode }) => (
  <div className={cx("toast-content", mode?.theme)}>
    <P1 bold className="toast-heading">
      {heading}
    </P1>
    <P2 className="toast-body">{body}</P2>
    {link && (
      <P2 bold className="toast-link">
        <a href={link}>Go to link page</a>
      </P2>
    )}
  </div>
);

export default ToastBody;
