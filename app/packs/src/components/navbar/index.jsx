import React, { useState } from "react"
import {
  faHome,
  faUserFriends,
  faHandHoldingUsd,
  faEnvelope,
  faStar
} from '@fortawesome/free-solid-svg-icons'

import NavbarItem from "./NavbarItem"
import TalBox from "./TalBox"
import Logo from "src/components/logo"

const Navbar = props => {
  const { talentPath, portfolioPath, messagesPath, tradePath, settingsPath, helpPath } = props

  const [navOpen, setNavOpen] = useState(false)

  const smallStyle = navOpen ? "d-sm-flex" : "d-none"

  return (
    <header className="d-flex flex-column justify-content-between navbar vh-100 py-4">
      <nav className="w-100" aria-label="Main navigation">
        <Logo />
        <button className="d-sm-flex d-md-none" onClick={() => setNavOpen(!navOpen)}>|||</button>

        <ul className={`navbar-nav mt-2 ${smallStyle} d-md-flex`}>
          <NavbarItem icon={faHome} text={"Home"} url={"/"} exact/>
          <NavbarItem icon={faUserFriends} text={"Talent"} url={talentPath}/>
          <NavbarItem icon={faHandHoldingUsd} text={"Portfolio"} url={portfolioPath}/>
          <NavbarItem icon={faEnvelope} text={"Messages"} url={messagesPath}/>
          <NavbarItem icon={faStar} text={"Trade $TAL"} url={tradePath}/>
        </ul>
      </nav>
      <nav aria-label="Secondary navigation" className={`${smallStyle} d-md-flex flex-column w-100`}>
        <ul className="navbar-nav">
          <NavbarItem text={"Settings"} url={settingsPath}/>
          <NavbarItem text={"Help"} url={helpPath}/>
        </ul>
        <TalBox price="1.58" variance="+12%"/>
      </nav>
    </header>
  )
}

export default Navbar