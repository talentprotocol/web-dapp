import React from "react";

const TokenDetails = ({ ticker, displayName }) => {
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
          <small>$1.00</small>
        </div>
        <div className="d-flex flex-row justify-content-between mt-2">
          <small>Market Value</small>
          <small>$10,000.00</small>
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
          <small>+$1,000.00</small>
        </div>
        <h6 className="card-subtitle mb-2 text-muted mt-4">
          {displayName} Token
        </h6>
        <div className="dropdown-divider border-secondary"></div>
        <div className="d-flex flex-row justify-content-between">
          <small>Circulating Supply</small>
          <small>21,000.00</small>
        </div>
        <div className="d-flex flex-row justify-content-between mt-2">
          <small>Max Supply</small>
          <small>100,000</small>
        </div>
        <div className="d-flex flex-row justify-content-between mt-2">
          <small>Total Sponsors</small>
          <small>146</small>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
