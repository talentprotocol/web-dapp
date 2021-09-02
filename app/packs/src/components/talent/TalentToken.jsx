import React, { useContext } from "react";
import currency from "currency.js";

import Button from "../button";
import DisplayTokenVariance from "../token/DisplayTokenVariance";

import Web3Container, { Web3Context } from "src/contexts/web3Context";
import AsyncValue from "../loader/AsyncValue";

const TalentToken = ({
  talentId,
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
      return currency(web3.tokens[tokenAddress]?.circulatingSupply, {
        fromCents: true,
      })
        .format()
        .substring(1);
    } else {
      return 0;
    }
  };

  const priceOfToken = web3.tokens[tokenAddress]?.dollarPerToken || 0.0;
  const marketCap = () => {
    const reserve = parseInt(web3.tokens[tokenAddress]?.reserve) || 0.0;

    return currency(reserve * web3.talToken.price, {
      fromCents: true,
    }).format();
  };

  return (
    <div className="d-flex flex-row flex-wrap border p-2 p-md-4 bg-white">
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Price</small>
          </div>
          <div>
            <strong>
              {web3.loading ? (
                <AsyncValue size={3} />
              ) : (
                currency(priceOfToken * web3.talToken?.price).format()
              )}
            </strong>
          </div>
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Market Cap</small>
          </div>
          <div>
            <strong>
              {web3.loading ? <AsyncValue size={5} /> : marketCap()}
            </strong>
          </div>
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Sponsor</small>
          </div>
          <div>
            <strong>{web3.loading ? <AsyncValue size={5} /> : sponsors}</strong>
          </div>
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Circ. Supply</small>
          </div>
          <div>
            <strong>
              {web3.loading ? <AsyncValue size={5} /> : circulatingSupply()}
            </strong>
          </div>
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Price (7D)</small>
          </div>
          {web3.loading ? (
            <div>
              <AsyncValue size={5} />
            </div>
          ) : (
            <DisplayTokenVariance variance={priceVariance7d} />
          )}
        </div>
      </div>
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Price (30D)</small>
          </div>
          {web3.loading ? (
            <div>
              <AsyncValue size={5} />
            </div>
          ) : (
            <DisplayTokenVariance variance={priceVariance30d} />
          )}
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
        {sponsors > 0 && (
          <Button
            href={`/talent/${talentId}/sponsors`}
            variant="outline-primary"
            text="See sponsors"
            className="talent-button w-100 mt-2"
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
