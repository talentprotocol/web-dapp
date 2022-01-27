import React from "react";

const BottomNavItem = ({ exact, url, secondaryUrl, Icon, mode, routeName }) => {
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
      className={`d-flex flex-column justify-content-center align-items-center ${mode}${
        urlMatches() ? " active" : ""
      }`}
    >
      <div
        className={`menu-icon ${mode}${urlMatches() ? " text-primary" : ""}`}
      >
        <Icon />
      </div>
      {urlMatches() ? <span className="text-primary">{routeName}</span> : null}
    </a>
  );
};

export default BottomNavItem;
