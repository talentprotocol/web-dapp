import React from "react"
import { Dropdown } from "react-bootstrap"

const Tabs = ({ tabs }) => {
  return tabs.map((tab) => {
    const url = new URL(document.location)

    if (url.pathname == tab.url) {
      return (
        <li key={`tab-${tab.url}`} className="nav-item mr-3">
          <a className="nav-link active tal-nav-item-active" href={tab.url}><small><strong>{tab.name}</strong></small></a>
        </li>
      )
    } else {
      return (
        <li key={`tab-${tab.url}`} className="nav-item mr-3">
          <a className="nav-link tal-nav-item" href={tab.url}><small>{tab.name}</small></a>
        </li>
      )
    }
  })
}

const DropdownOptions = ({ sortOptions, activeLabel }) => {
  return sortOptions.map((option) => {
    const url = new URL(document.location)

    if(url.searchParams.has("page")) {
      url.searchParams.delete("page")
    }

    if (url.searchParams.toString().includes(option.param) || activeLabel == option.label) {
      url.searchParams.set("sort", option.param)

      return (
        <Dropdown.Item key={`tab-dropdown-${option.param}`} href={url.toString()} className="text-primary">
          <small>{option.label}</small>
        </Dropdown.Item>
      )
    } else {
      url.searchParams.set("sort", option.param)

      return (
        <Dropdown.Item key={`tab-dropdown-${option.param}`} href={url.toString()}>
          <small>{option.label}</small>
        </Dropdown.Item>
      )
    }
  });
}

const getActiveSortLabel = (sortOptions) => {
  const url = new URL(document.location)
  const activeSort = url.searchParams.get("sort")

  const activeSortIndex = sortOptions.findIndex((item) => item.param == activeSort)

  if (activeSortIndex > 0) {
    return sortOptions[activeSortIndex].label
  } else {
    return sortOptions[0].label
  }
}

const NavTabs = ({ tabs, sortOptions }) => {
  const activeLabel = getActiveSortLabel(sortOptions)
  
  return (
    <ul className="nav nav-tabs d-flex flex-row justify-content-between">
      <div className="d-flex flex-row">
        <Tabs tabs={tabs}/>
      </div>
      <Dropdown className="d-flex align-items-center">
        <Dropdown.Toggle className="tal-nav-dropdown-btn" id="dropdown-basic">
          <small>{activeLabel}</small>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <DropdownOptions sortOptions={sortOptions} activeLabel={activeLabel}/>
        </Dropdown.Menu>
      </Dropdown>
    </ul>
  )
}

export default NavTabs
