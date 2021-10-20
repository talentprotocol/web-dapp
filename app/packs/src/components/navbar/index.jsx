import React from "react";
import {
  faUserFriends,
  faHandHoldingUsd,
  faEnvelope,
  faHome,
  faLock,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar, Container, Nav } from "react-bootstrap";

import NavbarItem from "./NavbarItem";
import TalentProfilePicture from "../talent/TalentProfilePicture";
import Logo from "src/components/logo";

const icon = (i) => <FontAwesomeIcon icon={i} className="mr-2" />;

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
      className="flex-lg-column py-3 lg-h-100 border-bottom"
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
            <h6 className="ml-3 mb-3">WATCHLIST</h6>
            {watchList.length == 0 && (
              <div className="d-flex flex-row align-items-center">
                <span className="text-warning">{icon(faStar)}</span>{" "}
                <small>Star a talent to display it here.</small>
              </div>
            )}
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
                <small>{watchItem.displayName}</small>
              </NavbarItem>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TalNavbar;
