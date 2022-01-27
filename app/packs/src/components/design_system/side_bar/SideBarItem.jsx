import React from "react";

const SideBarItem = ({ exact, url, secondaryUrl, Icon, mode, routeName }) => {
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
    <li>
      <a
        href={url}
        className={`d-flex flex-row align-items-center ${mode}${
          urlMatches() ? " active" : ""
        }`}
      >
        <div className={`menu-icon${urlMatches() ? " text-primary" : ""}`}>
          <Icon />
        </div>
        <span>{routeName}</span>
      </a>
    </li>
  );
};

export default SideBarItem;
