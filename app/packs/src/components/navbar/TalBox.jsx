import React from "react"

const TalBox = props => {
  return (
    <div className="border w-100 d-flex flex-column justify-content-center align-items-center py-3 mr-2">
      <h5 className="text-primary font-weight-bold">$TAL</h5>
      <div className="d-flex flex-row justify-content-center align-items-center">
        <span className="font-weight-bold mr-1">{props.price}</span>
        <small className="font-weight-lighter mr-1">USD</small>
        <small className="text-success tal-variance-box py-1 px-2">{props.variance}</small>
      </div>
    </div>
  )
}

export default TalBox
