import React, { useEffect, useState, useCallback } from "react";
import currency from "currency.js";

import Button from "../button";
import DisplayTokenVariance from "../token/DisplayTokenVariance";

import { OnChain } from "src/onchain";

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
  talentName,
}) => {
  const buttonText = active ? "Buy / Sell" : "Coming soon";
  const [factory, setFactory] = useState(null);
  const [token, setToken] = useState({
    circulatingSupply: 0,
  });

  const priceOfToken = 0.0;
  const marketCap = () => 0.0;

  const createToken = async (e) => {
    e.preventDefault();

    if (factory) {
      await factory.createTalent(talentName, ticker);
    }
  };

  const setupOnChain = useCallback(async () => {
    const newOnChain = new OnChain();
    let result;

    result = await newOnChain.initialize();

    if (!result) {
      return;
    }

    result = newOnChain.loadFactory();

    if (result) {
      setFactory(newOnChain);
      console.log("FACTORY LOADED");
    } else {
      console.log("NO FACTORY");
    }

    if (tokenAddress) {
      const _token = newOnChain.getToken(tokenAddress);
      const circulatingSupply = await _token.methods.totalSupply().call();
      setToken({
        circulatingSupply: newOnChain.web3.utils.fromWei(circulatingSupply),
      });
    }
  }, []);

  useEffect(() => {
    setupOnChain();
  }, []);

  return (
    <div className="d-flex flex-row flex-wrap border p-2 p-md-4 bg-white">
      <div className="col-6 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border">
          <div className="text-muted">
            <small>Price</small>
          </div>
          <div>
            <strong>{priceOfToken}</strong>
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
            <strong>{token.circulatingSupply}</strong>
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
        {sponsors > 0 && (
          <Button
            href={`/talent/${talentId}/sponsors`}
            variant="outline-primary"
            text="See sponsors"
            className="talent-button w-100 mt-2"
          />
        )}
        <Button
          type="primary"
          text={"Launch token"}
          className="talent-button w-100"
          onClick={createToken}
        />
      </div>
    </div>
  );
};

export default TalentToken;
