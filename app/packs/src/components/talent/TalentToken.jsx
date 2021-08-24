import React, { useContext } from "react";
import Button from "../button";
import DisplayTokenVariance from "../token/DisplayTokenVariance";

import Web3Container, { Web3Context } from "src/contexts/web3Context";

const TalentToken = ({
  ticker,
  sponsors,
  priceVariance7d,
  priceVariance30d,
  active,
  talentUserId,
  tokenAddress,
}) => {
  const web3 = useContext(Web3Context);
  const buttonText = active ? "Buy / Sell" : "Coming soon";

  const circulatingSupply = () => {
    if (web3.tokens[tokenAddress]?.circulatingSupply) {
      return parseInt(web3.tokens[tokenAddress]?.circulatingSupply) / 100.0;
    } else {
      return 0;
    }
  };

  const priceOfToken = web3.tokens[tokenAddress]?.dollarPerToken || 0.0;
  const marketCap = () => {
    const reserve = parseInt(web3.tokens[tokenAddress]?.reserve) || 0.0;

    return ((reserve * web3.talToken.price) / 100.0).toFixed(2);
  };

  return (
    <div className="d-flex flex-row flex-wrap border p-2 p-md-4 bg-white">
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Price</small>
          </div>
          <div>
            <strong>${(priceOfToken * web3.talToken?.price).toFixed(2)}</strong>
          </div>
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Market Cap</small>
          </div>
          <div>
            <strong>{marketCap()}</strong>
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
            <strong>{circulatingSupply()}</strong>
          </div>
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Price (7D)</small>
          </div>
          <DisplayTokenVariance variance={priceVariance7d} />
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Price (30D)</small>
          </div>
          <DisplayTokenVariance variance={priceVariance30d} />
        </div>
      </div>
      <div className="col-12 flex-wrap mt-2 px-1">
        <Button
          href={`/swap?ticker=${ticker}`}
          disabled={!active}
          type="primary"
          text={buttonText}
          className="talent-button w-100"
        />
        {talentUserId && (
          <Button
            type="outline-secondary"
            text="Send a message"
            className="talent-button w-100 mt-2"
            href={`/messages?user=${talentUserId}`}
          />
        )}
      </div>
    </div>
  );
};

const ConnectedTalentToken = (props) => (
  <Web3Container>
    <TalentToken {...props} />
  </Web3Container>
);

export default ConnectedTalentToken;
