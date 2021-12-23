import React from "react";
import Divider from "../other/divider";
import Caption from "src/components/design_system/typography/caption";
import P1 from "src/components/design_system/typography/p1";
import P2 from "src/components/design_system/typography/p2";

const TokenPrice = ({
  mode,
  ticker,
  token_address,
  display_name,
  price,
  market_value,
  circ_supply,
  max_supply,
  supporters_url,
  supporters_count,
}) => {
  return (
    <div className={`col-md-3 card ${mode}`}>
      <P1 text={`${ticker} Price Statistics`} mode={`${mode}`} bold="true"></P1>

      <div className="d-flex flex-column justify-content-between">
        <Caption
          className="text-muted"
          text="Token Address"
          mode={`${mode}`}
          bold="true"
        ></Caption>

        <small>{token_address || "Coming soon"}</small>
      </div>

      <P2
        className={`token-title`}
        text={`${display_name} Price today`}
        mode={`${mode}`}
        bold="true"
      ></P2>

      <Divider mode={`${mode}`} />

      <div className="row mt-1">
        <div className={`col-lg-6 token-item-title ${mode}`}>
          <strong>{ticker} Price</strong>
        </div>
        <div className="col-lg-6 text-right">
          <small>${price}</small>
        </div>
      </div>
      <div className="row mt-1">
        <div className={`col-lg-6 token-item-title ${mode}`}>
          <strong>{ticker} Market Value</strong>
        </div>
        <div className="col-lg-6 text-right">
          <small>${market_value}</small>
        </div>
      </div>

      <P2
        className={`token-title`}
        text={`${display_name} Token`}
        mode={`${mode}`}
        bold="true"
      ></P2>

      <Divider mode={`${mode}`} />

      <div className="row mt-1">
        <div className={`col-lg-6 token-item-title ${mode}`}>
          <strong>Circulating Supply</strong>
        </div>
        <div className="col-lg-6 text-right">
          <small>{circ_supply}</small>
        </div>
      </div>

      <div className="row mt-1">
        <div className={`col-lg-6 token-item-title ${mode}`}>
          <strong>Max Supply</strong>
        </div>
        <div className="col-lg-6 text-right">
          <small>{max_supply}</small>
        </div>
      </div>

      <div className="row mt-1">
        <div className={`col-lg-6 token-item-title ${mode}`}>
          <strong>
            Supporters{" "}
            <a className="text-reset" href={`${supporters_url}`}>
              (See more)
            </a>{" "}
          </strong>
        </div>
        <div className="col-lg-6 text-right">
          <small>{supporters_count}</small>
        </div>
      </div>
    </div>
  );
};

export default TokenPrice;
