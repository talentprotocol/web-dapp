import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { OnChain } from "src/onchain";
import currency from "currency.js";

const TokenDetails = ({ token, ticker, displayName }) => {
  const [talentToken, setTalentToken] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);

  const setupOnChain = useCallback(async () => {
    const newOnChain = new OnChain();
    let result;

    result = await newOnChain.initialize();

    if (!result) {
      return;
    }

    if (token.contract_id) {
      const _token = newOnChain.getToken(token.contract_id);
      if (_token) {
        setTalentToken(_token);

        _token
          .totalSupply()
          .then((_totalSupply) =>
            setTotalSupply(ethers.utils.formatUnits(_totalSupply))
          );
      }
    }
  }, []);

  useEffect(() => {
    setupOnChain();
  }, []);

  return (
    <div className="card bg-light mt-3 sticky-top" style={{ top: 20 }}>
      <div className="card-body">
        <h6 className="card-title">{ticker} Price Statistics</h6>
        <h6 className="card-subtitle mb-2 text-muted mt-4">
          {displayName} Price today
        </h6>
        <div className="dropdown-divider border-secondary"></div>
        <div className="d-flex flex-row justify-content-between">
          <small>{ticker} Price</small>
          <small>$0.10</small>
        </div>
        <div className="d-flex flex-row justify-content-between mt-2">
          <small>Market Value</small>
          <small>{currency(totalSupply * 0.1).format()}</small>
        </div>
        <div className="d-flex flex-row justify-content-between mt-2">
          <small>
            Market Change{" "}
            <span
              className="bg-dark p-1 rounded text-white"
              style={{ fontSize: 10 }}
            >
              24h
            </span>
          </small>
          <small>+$0.00</small>
        </div>
        <h6 className="card-subtitle mb-2 text-muted mt-4">
          {displayName} Token
        </h6>
        <div className="dropdown-divider border-secondary"></div>
        <div className="d-flex flex-row justify-content-between">
          <small>Circulating Supply</small>
          <small>{currency(totalSupply).format().substring(1)}</small>
        </div>
        <div className="d-flex flex-row justify-content-between mt-2">
          <small>Max Supply</small>
          <small>1,000,000</small>
        </div>
        <div className="d-flex flex-row justify-content-between mt-2">
          <small>Total Sponsors</small>
          <small>0</small>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
