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

import { TERMS_HREF, PRIVACY_HREF } from "src/utils/constants";

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
          className="flex-lg-column w-100 lg-h-100 lg-overflow-y-scroll"
          id="responsive-navbar-nav"
        >
          <Nav className="me-auto flex-lg-column w-100">
            <NavbarItem url={talentPath} secondaryUrl={"/"}>
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
          <Nav className="flex-lg-column w-100 mt-auto">
            <NavbarItem
              url={"https://talentprotocol.typeform.com/feedback"}
              target="self"
              noTracking
            >
              <small className="text-dark">Feedback</small>
            </NavbarItem>
            <NavbarItem url={TERMS_HREF} target="self" noTracking>
              <small>Terms & Conditions</small>
            </NavbarItem>
            <NavbarItem url={PRIVACY_HREF} target="self" noTracking>
              <small>Privacy Policy</small>
            </NavbarItem>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TalNavbar;
