import React from "react";
import Button from "../button";
import DisplayCoinVariance from "../coin/DisplayCoinVariance";

const TalentCoin = ({
  ticker,
  price,
  marketCap,
  sponsors,
  circulatingSupply,
  priceVariance7d,
  priceVariance30d,
  active,
}) => {
  const buttonText = active ? "Buy / Sell" : "Coming soon";
  return (
    <div className="d-flex flex-row flex-wrap border p-2 p-md-4 bg-white">
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Price</small>
          </div>
          <div>
            <strong>{price}</strong>
          </div>
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Market Cap</small>
          </div>
          <div>
            <strong>{marketCap}</strong>
          </div>
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Sponsor</small>
          </div>
          <div>
            <strong>{sponsors}</strong>
          </div>
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Circ. Supply</small>
          </div>
          <div>
            <strong>{circulatingSupply}</strong>
          </div>
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Price (7D)</small>
          </div>
          <DisplayCoinVariance variance={priceVariance7d} />
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Price (30D)</small>
          </div>
          <DisplayCoinVariance variance={priceVariance30d} />
        </div>
      </div>
      <div className="col-12 mt-2 px-1">
        <Button
          href={`/swap?ticker=${ticker}`}
          disabled={!active}
          type="primary"
          text={buttonText}
          className="talent-button w-100"
        />
      </div>
    </div>
  );
};

export default TalentCoin;
