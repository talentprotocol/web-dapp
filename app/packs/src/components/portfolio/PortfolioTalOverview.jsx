import React from "react";
import { useSpring, animated, config } from "@react-spring/web";
import currency from "currency.js";

import AsyncValue from "../loader/AsyncValue";

const AnimatedNumber = ({ value, unformatted, dollarSign }) => {
  const { number } = useSpring({
    reset: true,
    reverse: false,
    from: { number: 0 },
    number: value,
    delay: 10,
    config: config.default,
  });

  return (
    <animated.h4>
      {number.to((n) =>
        unformatted
          ? `${n}`
          : `${
              dollarSign
                ? currency(n).format()
                : currency(n).format().substring(1)
            }`
      )}
    </animated.h4>
  );
};

const PortfolioTalOverview = ({
  loading,
  cUSDBalance,
  totalTal,
  yieldSum,
  talentCount,
}) => {
  return (
    <div className="d-flex flex-row flex-wrap pt-3 pb-4 align-items-center">
      <div className="col-12 col-sm-6 col-md-3 mt-2 pr-1 pl-0">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted">
            <small>cUSD</small>
          </div>
          {loading ? (
            <h4>
              <AsyncValue size={12} />
            </h4>
          ) : (
            <AnimatedNumber value={cUSDBalance} />
          )}
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-3 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted">
            <small>$TAL Invested</small>
          </div>
          {loading ? (
            <h4>
              <AsyncValue size={12} />
            </h4>
          ) : (
            <AnimatedNumber value={totalTal} />
          )}
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-3 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted">
            <small>Total Yield ($TAL)</small>
          </div>
          {loading ? (
            <h4>
              <AsyncValue size={12} />
            </h4>
          ) : (
            <AnimatedNumber value={yieldSum} />
          )}
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-3 mt-2 pl-1 pr-0">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted">
            <small>Talent supported</small>
          </div>
          <h4>{talentCount}</h4>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTalOverview;
