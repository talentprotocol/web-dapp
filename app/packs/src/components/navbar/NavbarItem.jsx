import React from "react";
import { Nav } from "react-bootstrap";

const NavbarItem = (props) => {
  const urlMatches = () => {
    if (props.exact) {
      return window.location.pathname == props.url;
    } else {
      const mainMatches = window.location.pathname.includes(props.url);
      const secondaryMatchesExact =
        window.location.pathname == props.secondaryUrl;

      return mainMatches || secondaryMatchesExact;
    }
  };

  const active = props.noTracking ? false : urlMatches();

  return (
    <Nav.Link
      href={props.url}
      target={props.target}
      className={`${
        active ? "text-primary" : "text-secondary"
      } mt-2 d-flex flex-row align-items-center`}
    >
      {props.children}
    </Nav.Link>
  );
};

export default NavbarItem;
