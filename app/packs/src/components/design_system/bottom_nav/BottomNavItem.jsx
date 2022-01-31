import React from "react";
import { P3 } from "src/components/design_system/typography";
import cx from "classnames";

const BottomNavItem = ({ exact, url, secondaryUrl, Icon, routeName }) => {
  const urlMatches = () => {
    if (exact) {
      return window.location.pathname == url;
    } else {
      const mainMatches = window.location.pathname.includes(url);
      const secondaryMatchesExact = window.location.pathname == secondaryUrl;

      return mainMatches || secondaryMatchesExact;
    }
  };

  return (
    <a
      href={url}
      className={cx(
        "d-flex flex-column justify-content-center align-items-center",
        urlMatches() && "active"
      )}
    >
      <div className={cx("mobile-menu-icon", urlMatches() && "text-primary")}>
        <Icon />
      </div>
      {urlMatches() && <P3 className="text-primary" text={routeName} />}
    </a>
  );
};

export default BottomNavItem;
