import React from "react"
import {
  faUserFriends,
  faHandHoldingUsd,
  faEnvelope,
  faStar,
  faCog,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Navbar, Container, Nav } from 'react-bootstrap'

import NavbarItem from "./NavbarItem"
import TalBox from "./TalBox"
import Logo from "src/components/logo"

const icon = (i) => <FontAwesomeIcon icon={i} />

const TalNavbar = props => {
  const { talentPath, portfolioPath, messagesPath, tradePath, settingsPath, helpPath } = props

  return (
    <Navbar collapseOnSelect className="flex-lg-column py-3 lg-h-100 border-right border-bottom" expand="lg">
      <Container className="flex-lg-column align-items-lg-start lg-h-100 my-0 my-lg-3">
        <Navbar.Brand href="/"><Logo /></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="flex-lg-column w-100 lg-h-100 justify-content-lg-between" id="responsive-navbar-nav">
          <Nav className="me-auto flex-lg-column w-100">
            <NavbarItem url={talentPath}>{icon(faUserFriends)} Talent</NavbarItem>
            <NavbarItem url={portfolioPath}>{icon(faHandHoldingUsd)} Portfolio</NavbarItem>
            <NavbarItem url={messagesPath}>{icon(faEnvelope)} Messages</NavbarItem>
            <NavbarItem url={tradePath} exact>{icon(faStar)} Trade $TAL</NavbarItem>
          </Nav>
          <Nav className="flex-lg-column w-100 mt-3 mt-lg-0">
            <NavbarItem url={settingsPath} exact>{icon(faCog)} Settings</NavbarItem>
            <NavbarItem url={helpPath} exact>{icon(faQuestionCircle)} Help</NavbarItem>
            <TalBox price="1.58" variance="+12%"/>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default TalNavbar