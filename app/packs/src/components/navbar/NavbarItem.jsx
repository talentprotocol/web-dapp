import React from "react"

const NavbarItem = props => {
  const urlExactMatch = () => window.location.pathname == props.url
  const urlPartialMatch = () => window.location.pathname.includes(props.url)

  const active = props.exact ? urlExactMatch() : urlPartialMatch()

  return (
    <li className="nav-item my-1">
      <a className={`nav-link d-none d-md-block ${active ? "text-primary" : "text-secondary"}`} href={props.url}>
        {props.icon} {props.text}
      </a>
      <a className={`nav-link d-block d-md-none ${active ? "text-primary" : "text-secondary"}`} href={props.url}>
        {props.icon}
      </a>
    </li>
  )
}

export default NavbarItem
