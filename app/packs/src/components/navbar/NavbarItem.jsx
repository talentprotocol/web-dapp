import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const NavbarItem = props => {
  const urlExactMatch = () => window.location.pathname == props.url
  const urlPartialMatch = () => window.location.pathname.includes(props.url)

  const active = props.exact ? urlExactMatch() : urlPartialMatch()

  return (
    <li className="nav-item my-1">
      <a className={`nav-link ${active ? "text-primary" : "text-secondary"}`} href={props.url}>
        {props.icon} {props.text}
      </a>
    </li>
  )
}

export default NavbarItem
