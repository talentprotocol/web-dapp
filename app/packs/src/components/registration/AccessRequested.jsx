import React, { useEffect, useState } from 'react'

import {
  faSpinner,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { post } from "../../utils/requests"

const renderStatus = (status, errorDetails) => {
  if(status == "loading") {
    return (
      <div className="d-flex flex-row text-muted align-items-center">
        <FontAwesomeIcon icon={faSpinner} spin/>
        <p className="ml-2 mb-0">Adding you to the wait list..</p>
      </div>
    )
  } else if(status == "error") {
    return (
      <div className="d-flex flex-row text-danger align-items-center">
        <FontAwesomeIcon icon={faTimes}/>
        <p className="ml-2 mb-0">{errorDetails}</p>
      </div>
    )
  } else if(status == "success") {
    return (
      <div className="d-flex flex-row text-success align-items-center">
        <FontAwesomeIcon icon={faCheck}/>
        <p className="ml-2 mb-0">You're on the wait list!</p>
      </div>
    )
  }
}

const AccessRequested = ({ changeStep, email }) => {
  const [status, setStatus] = useState("loading")
  const [errorDetails, setErrorDetails] = useState("")

  useEffect(() => {
    post(
      "/wait_list.json",
      { email }
    ).then((response) => {
      if(response.error) {
        setStatus("error")
        setErrorDetails(response.error)
      } else {
        setStatus("success")
      }
    })
  }, [email])

  return (
    <div className="d-flex flex-column" style={{ maxWidth: 400 }}>
      <h1>We'll be in touch!</h1>
      <p>Thank you for showing interest in Talent Protocol. We're working hard to make the platform available to everyone.</p>
      {renderStatus(status, errorDetails)}
      <button type="button" disabled={status == "loading"} onClick={() => changeStep(1)} className="mt-2 btn btn-light talent-button">{"<"} Back</button>
    </div>
  )
}

export default AccessRequested