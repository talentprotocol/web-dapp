import React from "react";
import { useSpring, animated, config } from "@react-spring/web";
import currency from "currency.js";

import AsyncValue from "../loader/AsyncValue";

const AnimatedNumber = ({ value, unformatted, dollarSign, unit }) => {
  const { number } = useSpring({
    reset: true,
    reverse: false,
    from: { number: 0 },
    number: value,
    delay: 10,
    config: config.default,
  });

  const unitString = unit ? unit : "";

  return (
    <animated.h4>
      {number.to((n) =>
        unformatted
          ? `${n}${unitString}`
          : `${
              dollarSign
                ? currency(n).format()
                : currency(n).format().substring(1)
            }${unitString}`
      )}
    </animated.h4>
  );
};

const PortfolioTalOverview = ({
  cUSDBalance,
  talentTokensTotal,
  totalYield,
}) => {
  const cUSDBalanceInTAL = cUSDBalance * 50;
  const totalYieldInCUSD = totalYield * 0.02;
  const talentTokensInTAL = talentTokensTotal * 5;
  const talentTokensInCUSD = talentTokensTotal * 0.1;

  const overallCUSD = cUSDBalance + totalYieldInCUSD + talentTokensInCUSD;
  const overallTAL = cUSDBalanceInTAL + totalYield + talentTokensInTAL;
  return (
    <div className="d-flex flex-row flex-wrap pt-3 pb-4 align-items-stretch">
      <div className="col-12 col-md-6 col-lg-3 mt-2 pr-1 pl-0">
        <div className="d-flex flex-column align-items-start border bg-light py-4 h-100">
          <div className="text-warning ml-3">
            <small>
              <strong>TOTAL BALANCE</strong>
            </small>
          </div>
          <h3 className="ml-3 mt-4">
            <strong>{currency(overallTAL).format().substring(1)}</strong>
            <small className="text-muted"> TAL</small>
          </h3>
          <h3 className="ml-3 text-muted">
            <small>{currency(overallCUSD).format()}</small>
          </h3>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-3 mt-2 pr-1 pl-0">
        <div className="d-flex flex-column align-items-start border bg-light py-4 h-100">
          <div className="ml-3 text-warning">
            <small>
              <strong>CUSD BALANCE</strong>
            </small>
          </div>
          <h3 className="ml-3 mt-4">
            <strong>{currency(cUSDBalanceInTAL).format().substring(1)}</strong>
            <small className="text-muted"> TAL</small>
          </h3>
          <h3 className="ml-3 text-muted">
            <small>{currency(cUSDBalance).format()}</small>
          </h3>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-3 mt-2 pr-1 pl-0">
        <div className="d-flex flex-column align-items-start border bg-light py-4 h-100">
          <div className="ml-3 text-warning">
            <small>
              <strong>REWARDS TOTAL</strong>
            </small>
          </div>
          <h3 className="ml-3 mt-4">
            <strong>{currency(totalYield).format().substring(1)}</strong>
            <small className="text-muted"> TAL</small>
          </h3>
          <h3 className="ml-3 text-muted">
            <small>{currency(totalYieldInCUSD).format()}</small>
          </h3>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-3 mt-2 pr-1 pl-0">
        <div className="d-flex flex-column align-items-start border bg-light py-4 h-100">
          <div className="text-warning ml-3">
            <small>
              <strong>TALENT TOKENS BALANCE</strong>
            </small>
          </div>
          <h3 className="ml-3 mt-4">
            <strong>{currency(talentTokensInTAL).format().substring(1)}</strong>
            <small className="text-muted"> TAL</small>
          </h3>
          <h3 className="ml-3 text-muted">
            <small>{currency(talentTokensInCUSD).format()}</small>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTalOverview;
