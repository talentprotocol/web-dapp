import React, { useContext } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import currency from "currency.js";

import Web3Container, { Web3Context } from "src/contexts/web3Context";
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

const PortfolioTalOverview = ({ talCommited, talentCount, talValue }) => {
  const web3 = useContext(Web3Context);

  return (
    <div className="d-flex flex-row flex-wrap pt-3 pb-4 align-items-center">
      <div className="col-12 col-sm-6 col-md-3 mt-2 pr-1 pl-0">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted">
            <small>$TAL</small>
          </div>
          {web3.loading ? (
            <h4>
              <AsyncValue size={12} />
            </h4>
          ) : (
            <AnimatedNumber value={web3.talToken?.balance} />
          )}
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-3 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted">
            <small>$TAL invested</small>
          </div>
          {web3.loading ? (
            <h4>
              <AsyncValue size={12} />
            </h4>
          ) : (
            <AnimatedNumber value={talCommited} />
          )}
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-3 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted">
            <small>$TAL Total (USD)</small>
          </div>
          {web3.loading ? (
            <h4>
              <AsyncValue size={12} />
            </h4>
          ) : (
            <AnimatedNumber
              dollarSign={true}
              value={((web3.talToken?.balance || 0.0) + talCommited) * talValue}
            />
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

const ConnectedOverview = (props) => (
  <Web3Container>
    <PortfolioTalOverview {...props} />
  </Web3Container>
);

export default ConnectedOverview;
