import React from "react";
import {
  faUserFriends,
  faHandHoldingUsd,
  faEnvelope,
  faHome,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar, Container, Nav } from "react-bootstrap";

import NavbarItem from "./NavbarItem";
import TalentProfilePicture from "../talent/TalentProfilePicture";
import Logo from "src/components/logo";

const icon = (i) => <FontAwesomeIcon icon={i} />;

const TalNavbar = (props) => {
  const {
    feedPath,
    talentPath,
    portfolioPath,
    messagesPath,
    admin,
    adminPath,
    watchList,
  } = props;

  return (
    <Navbar
      collapseOnSelect
      className="flex-lg-column py-3 lg-h-100 border-right border-bottom"
      expand="lg"
    >
      <Container className="flex-lg-column align-items-lg-start lg-h-100 my-0 my-lg-3">
        <Navbar.Brand href="/">
          <Logo />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          className="flex-lg-column w-100 lg-h-100"
          id="responsive-navbar-nav"
        >
          <Nav className="me-auto flex-lg-column w-100">
            <NavbarItem url={feedPath} exact>
              {icon(faHome)} Home
            </NavbarItem>
            <NavbarItem url={talentPath}>
              {icon(faUserFriends)} Talent
            </NavbarItem>
            <NavbarItem url={portfolioPath}>
              {icon(faHandHoldingUsd)} Portfolio
            </NavbarItem>
            <NavbarItem url={messagesPath}>
              {icon(faEnvelope)} Messages
            </NavbarItem>
            {admin && (
              <NavbarItem url={adminPath}>{icon(faLock)} Admin</NavbarItem>
            )}
          </Nav>
          <Nav className="flex-lg-column w-100 mt-5">
            <h6>WATCHLIST</h6>
            {watchList.map((watchItem) => (
              <NavbarItem
                key={`watch_list_item_${watchItem.id}`}
                url={watchItem.url}
                noTracking
              >
                <TalentProfilePicture
                  src={watchItem.picture}
                  height={24}
                  className="mr-2"
                />{" "}
                {watchItem.displayName}
              </NavbarItem>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TalNavbar;
