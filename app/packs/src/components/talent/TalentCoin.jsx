import React from 'react'
import Button from '../button'

const displayVariance = (variance) => {
  const dVariance = variance.replace("-", "")

  if (variance[0] == "-") {
    return (<div className="text-danger"><strong>{'\u2228'} {dVariance}%</strong></div>)
  } else {
    return (<div className="text-success"><strong>{'\u2227'} {dVariance}%</strong></div>)
  }
}

const TalentCoin = ({
  price,
  marketCap,
  sponsors,
  circulatingSupply,
  priceVariance7d,
  priceVariance30d
}) => {
  return (
    <div className="d-flex flex-row flex-wrap border p-4 bg-white">
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted"><small>Price</small></div>
          <div><strong>{price}</strong></div>
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted"><small>Market Cap</small></div>
          <div><strong>{marketCap}</strong></div>
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted"><small>Sponsor</small></div>
          <div><strong>{sponsors}</strong></div>
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted"><small>Circ. Supply</small></div>
          <div><strong>{circulatingSupply}</strong></div>
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted"><small>Price (7D)</small></div>
          {displayVariance(priceVariance7d)}
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted"><small>Price (30D)</small></div>
          {displayVariance(priceVariance30d)}
        </div>
      </div>
      <div className="col-12 mt-2 px-1">
        <Button type="primary" text="Buy / Sell" className="talent-button w-100"/>
      </div>
    </div>
  )
}

export default TalentCoin