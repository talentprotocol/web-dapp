import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { OnChain } from "src/onchain";
import currency from "currency.js";

import {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO_FOR_ID_SIMPLE,
  client,
} from "src/utils/thegraph";

const TokenDetails = ({ token, ticker, displayName }) => {
  const { loading, error, data } = useQuery(
    GET_TALENT_PORTFOLIO_FOR_ID_SIMPLE,
    {
      variables: { id: token?.contract_id?.toLowerCase() },
    }
  );

  const [tokenData, setTokenData] = useState({
    price: 0.1,
    totalSupply: 0,
    supporterCount: 0,
  });

  useEffect(() => {
    if (loading || !data || !data.talentToken) {
      return;
    }

    setTokenData({
      ...tokenData,
      totalSupply: ethers.utils.formatUnits(data.talentToken.totalSupply || 0),
      supporterCount: data.talentToken.supporterCounter || 0,
    });
  }, [data, loading]);

  return (
    <div
      className="card bg-light mt-3 sticky-top"
      style={{ top: 20, zIndex: 1 }}
    >
      <div className="card-body">
        <h6 className="card-title">{ticker} Price Statistics</h6>
        <div className="d-flex flex-column justify-content-between">
          <small className="text-muted">Token Address</small>
          <small>{token.contract_id || "Coming soon"}</small>
        </div>
        <h6 className="card-subtitle mb-2 text-muted mt-4">
          {displayName} Price today
        </h6>
        <div className="dropdown-divider border-secondary"></div>
        <div className="d-flex flex-row justify-content-between">
          <small>{ticker} Price</small>
          <small>${tokenData.price}</small>
        </div>
        <div className="d-flex flex-row justify-content-between mt-2">
          <small>Market Value</small>
          <small>{currency(tokenData.totalSupply * 0.1).format()}</small>
        </div>
        {/* <div className="d-flex flex-row justify-content-between mt-2">
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
        </div> */}
        <h6 className="card-subtitle mb-2 text-muted mt-4">
          {displayName} Token
        </h6>
        <div className="dropdown-divider border-secondary"></div>
        <div className="d-flex flex-row justify-content-between">
          <small>Circulating Supply</small>
          <small>{currency(tokenData.totalSupply).format().substring(1)}</small>
        </div>
        <div className="d-flex flex-row justify-content-between mt-2">
          <small>Max Supply</small>
          <small>1,000,000</small>
        </div>
        <div className="d-flex flex-row justify-content-between mt-2">
          <small>Total Supporters</small>
          <small>{tokenData.supporterCount}</small>
        </div>
      </div>
    </div>
  );
};

export default (props) => (
  <ApolloProvider client={client}>
    <TokenDetails {...props} />
  </ApolloProvider>
);
