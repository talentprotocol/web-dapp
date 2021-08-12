import React from "react";
import { Nav } from "react-bootstrap";

const NavbarItem = (props) => {
  const urlExactMatch = () => window.location.pathname == props.url;
  const urlPartialMatch = () => window.location.pathname.includes(props.url);

  const active = props.exact ? urlExactMatch() : urlPartialMatch();

  return (
    <Nav.Link
      href={props.url}
      className={`${active ? "text-primary" : "text-secondary"} mt-2`}
    >
      {props.children}
    </Nav.Link>
  );
};

export default NavbarItem;
