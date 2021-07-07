import React, { useState } from "react"
import {
  faHome,
  faUserFriends,
  faHandHoldingUsd,
  faEnvelope,
  faStar,
  faBars
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import NavbarItem from "./NavbarItem"
import TalBox from "./TalBox"
import Logo from "src/components/logo"

const icon = (i) => <FontAwesomeIcon icon={i} />

// break this component into two separate components, SmNavbar (non-fixed) & MdNavbar (Fixed)
const Navbar = props => {
  const { talentPath, portfolioPath, messagesPath, tradePath, settingsPath, helpPath } = props

  const [navOpen, setNavOpen] = useState(false)

  const smallStyle = navOpen ? "d-sm-flex" : "d-none"

  return (
    <header className="d-flex flex-column justify-content-between navbar md-vh-100 py-sm-2 py-md-4">
      <nav className="w-100" aria-label="Main navigation">
        <Logo />
        <button className="d-sm-flex d-md-none btn btn-link ml-5" type="button" onClick={() => setNavOpen(!navOpen)}>
          {icon(faBars)}
        </button>

        <ul className={`navbar-nav mt-2 ${smallStyle} d-md-flex`}>
          <NavbarItem icon={icon(faHome)} text={"Home"} url={"/"} exact/>
          <NavbarItem icon={icon(faUserFriends)} text={"Talent"} url={talentPath}/>
          <NavbarItem icon={icon(faHandHoldingUsd)} text={"Portfolio"} url={portfolioPath} exact/>
          <NavbarItem icon={icon(faEnvelope)} text={"Messages"} url={messagesPath}/>
          <NavbarItem icon={icon(faStar)} text={"Trade $TAL"} url={tradePath} exact/>
        </ul>
      </nav>
      <nav aria-label="Secondary navigation" className={`${smallStyle} d-md-flex flex-column w-100`}>
        <ul className="navbar-nav">
          <NavbarItem text={"Settings"} url={settingsPath} exact/>
          <NavbarItem text={"Help"} url={helpPath} exact/>
        </ul>
        <TalBox price="1.58" variance="+12%"/>
      </nav>
    </header>
  )
}

export default Navbar