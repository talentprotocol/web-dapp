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
    <Navbar collapseOnSelect className="flex-lg-column py-3" expand="lg">
      <Container className="flex-lg-column align-items-lg-start">
        <Navbar.Brand href="/"><Logo /></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="flex-lg-column w-100" id="responsive-navbar-nav">
          <Nav className="me-auto flex-lg-column w-100">
            <Nav.Link href={talentPath}>{icon(faUserFriends)} Talent</Nav.Link>
            <Nav.Link href={portfolioPath}>{icon(faHandHoldingUsd)} Portfolio</Nav.Link>
            <Nav.Link href={messagesPath}>{icon(faEnvelope)} Messages</Nav.Link>
            <Nav.Link href={tradePath}>{icon(faStar)} Trade $TAL</Nav.Link>
          </Nav>
          <Nav className="flex-lg-column w-100">
            <Nav.Link href={settingsPath}>{icon(faCog)} Settings</Nav.Link>
            <Nav.Link href={helpPath}>{icon(faQuestionCircle)} Help</Nav.Link>
            <TalBox price="1.58" variance="+12%"/>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default TalNavbar