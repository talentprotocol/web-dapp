import React from 'react'

const DisplayCoinVariance = ({ variance, withoutArrow }) => {
  const dVariance = variance.replace("-", "")
  const upArrow = withoutArrow ? '' : '\u2228 '
  const downArrow = withoutArrow ? '' : '\u2227 '

  if (variance[0] == "-") {
    return (<div className="text-danger"><strong>{upArrow}{dVariance}%</strong></div>)
  } else {
    return (<div className="text-success"><strong>{downArrow}{dVariance}%</strong></div>)
  }
}

export default DisplayCoinVariance