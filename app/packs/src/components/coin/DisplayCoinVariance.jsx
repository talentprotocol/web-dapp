import React from 'react'

import {
  faAngleUp,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const icon = (i) => <FontAwesomeIcon icon={i} />

const DisplayCoinVariance = ({ variance, withoutArrow }) => {
  const dVariance = variance.replace("-", "")

  if (variance[0] == "-") {
    return (<div className="text-danger"><strong>{withoutArrow ? '' : icon(faAngleUp)} {dVariance}%</strong></div>)
  } else {
    return (<div className="text-success"><strong>{withoutArrow ? '' : icon(faAngleDown)} {dVariance}%</strong></div>)
  }
}

export default DisplayCoinVariance