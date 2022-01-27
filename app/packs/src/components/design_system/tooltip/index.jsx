import React from "react";
import cx from "classnames";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import P3 from "src/components/design_system/typography/p3";
import { node, string, bool, arrayOf, oneOfType } from "prop-types";

const Tooltip = ({
  placement,
  trigger,
  rootClose,
  children,
  popOverContent,
  title,
  body,
  popOverAccessibilityId,
  className,
  mode,
  hide,
}) => {
  if (hide) {
    return children;
  }

  return (
    <OverlayTrigger
      placement={placement}
      trigger={trigger}
      rootClose={rootClose}
      overlay={
        <Popover
          id={popOverAccessibilityId}
          className={cx(className, "talent-tooltip", mode)}
        >
          {popOverContent ? (
            popOverContent
          ) : (
            <>
              {title && <P3 text={title} bold className="tooltip-title" />}
              {body && <P3 text={body} bold className="tooltip-body" />}
            </>
          )}
        </Popover>
      }
    >
      {children}
    </OverlayTrigger>
  );
};

Tooltip.propTypes = {
  popOverContent: node,
  children: node.isRequired,
  title: string,
  body: string,
  popOverAccessibilityId: string.isRequired,
  placement: string,
  trigger: oneOfType([string, arrayOf(string)]),
  rootClose: bool,
  className: string,
  mode: string,
  hide: bool,
};

Tooltip.defaultProps = {
  popOverContent: "",
  title: "",
  body: "",
  placement: "bottom",
  trigger: ["hover", "focus", "click"],
  rootClose: true,
  className: "",
  mode: "light",
  hide: false,
};

export default Tooltip;
