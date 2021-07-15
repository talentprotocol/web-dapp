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

import NavbarItem from "./NavbarItem"
import TalBox from "./TalBox"
import Logo from "src/components/logo"

const icon = (i) => <FontAwesomeIcon icon={i} />

const Navbar = props => {
  const { talentPath, portfolioPath, messagesPath, tradePath, settingsPath, helpPath } = props

  return (
    <header className="d-flex flex-column justify-content-between navbar vh-100 py-4 px-0">
      <nav className="w-100 align-items-center align-items-md-start" aria-label="Main navigation">
        <Logo />
        <ul className="navbar-nav mt-2 align-items-center align-items-md-start">
          <NavbarItem icon={icon(faUserFriends)} text={"Talent"} url={talentPath}/>
          <NavbarItem icon={icon(faHandHoldingUsd)} text={"Portfolio"} url={portfolioPath} exact/>
          <NavbarItem icon={icon(faEnvelope)} text={"Messages"} url={messagesPath}/>
          <NavbarItem icon={icon(faStar)} text={"Trade $TAL"} url={tradePath} exact/>
        </ul>
      </nav>
      <nav aria-label="Secondary navigation" className="w-100">
        <ul className="navbar-nav align-items-center align-items-md-start">
          <NavbarItem icon={icon(faCog)} text={"Settings"} url={settingsPath} exact/>
          <NavbarItem icon={icon(faQuestionCircle)} text={"Help"} url={helpPath} exact/>
        </ul>
        <TalBox price="1.58" variance="+12%"/>
      </nav>
    </header>
  )
}

export default Navbar