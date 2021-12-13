import React from 'react';
import Divider from '../other/divider';

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
            <h6><strong>{ticker} Price Statistics</strong></h6>

            <div className="d-flex flex-column justify-content-between">
                <small className="text-muted">Token Address</small>
                <small>{token_address || "Coming soon"}</small>
            </div>

            <h6 className={`token-title ${mode}`}> {display_name} Price today </h6>
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

            <h6 className={`token-title ${mode}`}> {display_name} Token </h6>
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
                    <strong>Supporters {" "}
                        <a className="text-reset" href={`${supporters_url}`}>(See more)</a> </strong>
                </div>
                <div className="col-lg-6 text-right">
                    <small>{supporters_count}</small>
                </div>
            </div>

        </div>
    )
};

export default TokenPrice;