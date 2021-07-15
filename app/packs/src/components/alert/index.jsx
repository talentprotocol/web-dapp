import React from "react"

import Button from "../button"

const Alert = (props) => {
  const { type, text, buttonText, href } = props

  const typeStyles = `alert-${type} talent-alert-${type}`

  return (
    <div className={`alert talent-alert d-flex flex-column flex-sm-row align-items-center justify-content-between ${typeStyles}`} role="alert">
      <p className="mb-0 mr-md-3">{text}</p>{href && <Button type={type} text={buttonText} href={href} />}
    </div>
  )
}

export default Alert