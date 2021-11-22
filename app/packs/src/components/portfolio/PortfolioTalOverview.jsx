import React from "react";
import { useSpring, animated, config } from "@react-spring/web";
import currency from "currency.js";

const PortfolioTalOverview = ({
  cUSDBalance,
  talentTokensTotal,
  rewardsClaimed,
}) => {
  const cUSDBalanceInTAL = cUSDBalance * 50;
  const totalRewardsInCUSD = rewardsClaimed * 0.02;
  const talentTokensInTAL = talentTokensTotal * 5;
  const talentTokensInCUSD = talentTokensTotal * 0.1;

  const overallCUSD = cUSDBalance + talentTokensInCUSD;
  const overallTAL = cUSDBalanceInTAL + talentTokensInTAL;
  return (
    <div className="d-flex flex-row flex-wrap pt-3 pb-4 align-items-stretch">
      <div className="col-12 col-md-6 col-lg-3 mt-2 pr-0 pr-md-3 pl-0">
        <div className="d-flex flex-column align-items-start border bg-light py-4 h-100">
          <div className="text-warning ml-3">
            <small>
              <strong>TOTAL BALANCE</strong>
            </small>
          </div>
          <h4 className="ml-3 mt-4">
            <strong>{currency(overallCUSD).format()}</strong>
          </h4>
          <h4 className="ml-3 text-muted">
            <small>{currency(overallTAL).format().substring(1)}</small>
            <small> $TAL</small>
          </h4>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-3 mt-2 pr-0 pr-lg-3 pl-0">
        <div className="d-flex flex-column align-items-start border bg-light py-4 h-100">
          <div className="ml-3 text-warning">
            <small>
              <strong>WALLET BALANCE</strong>
            </small>
          </div>
          <h4 className="ml-3 mt-4">
            <strong>{currency(cUSDBalance).format()}</strong>
          </h4>
          <h4 className="ml-3 text-muted">
            <small>{currency(cUSDBalanceInTAL).format().substring(1)}</small>
            <small className="text-muted"> $TAL</small>
          </h4>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-3 mt-2 pr-0 pr-md-3 pl-0">
        <div className="d-flex flex-column align-items-start border bg-light py-4 h-100">
          <div className="ml-3 text-warning">
            <small>
              <strong>TOTAL REWARDS CLAIMED</strong>
            </small>
          </div>
          <h4 className="ml-3 mt-4">
            <strong>{currency(totalRewardsInCUSD).format()}</strong>
          </h4>
          <h4 className="ml-3 text-muted">
            <small>{currency(rewardsClaimed).format().substring(1)}</small>
            <small className="text-muted"> $TAL</small>
          </h4>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-3 mt-2 pr-0 pl-0">
        <div className="d-flex flex-column align-items-start border bg-light py-4 h-100">
          <div className="text-warning ml-3">
            <small>
              <strong>TALENT TOKENS BALANCE</strong>
            </small>
          </div>
          <h4 className="ml-3 mt-4">
            <strong>{currency(talentTokensInCUSD).format()}</strong>
          </h4>
          <h4 className="ml-3 text-muted">
            <small>{currency(talentTokensInTAL).format().substring(1)}</small>
            <small className="text-muted"> $TAL</small>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTalOverview;
