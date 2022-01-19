import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import currency from "currency.js";

import Divider from "src/components/design_system/other/divider";
import { P1, P2 } from "src/components/design_system/typography";

import {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO_FOR_ID_SIMPLE,
  client,
} from "src/utils/thegraph";

const TokenDetails = ({
  token,
  ticker,
  displayName,
  username,
  mobile,
  className,
}) => {
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
      className={`card ${
        mobile ? "p-0 remove-background" : "bg-light"
      } mt-3 ${className}`}
    >
      <div>
        <P1
          bold
          text={`${ticker} Price Statistics`}
          className="text-black mb-4"
        />
        <P2 text={`${displayName} Price today`} className="text-primary-04" />
        <Divider className="mt-2 mb-3" />
        <div className="d-flex flex-row justify-content-between">
          <P2 bold text={`${ticker} Price`} className="text-primary-03" />
          <P2 text={`$${tokenData.price}`} className="text-black" />
        </div>
        <div className="d-flex flex-row justify-content-between mt-3">
          <P2 bold text="Market Value" className="text-primary-03" />
          <P2
            text={currency(tokenData.totalSupply * 0.1).format()}
            className="text-black"
          />
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
        <P2
          text={`${displayName} Market Cap`}
          className="text-primary-04 mt-4"
        />
        <Divider className="mt-2 mb-3" />
        <div className="d-flex flex-row justify-content-between">
          <P2 bold text="Circulating Supply" className="text-primary-03" />
          <P2
            text={currency(tokenData.totalSupply).format().substring(1)}
            className="text-black"
          />
        </div>
        <div className="d-flex flex-row justify-content-between mt-3">
          <P2 bold text="Max Supply" className="text-primary-03" />
          <P2 text="1,000,000" className="text-black" />
        </div>
        <div className="d-flex flex-row justify-content-between mt-3">
          <P2 bold text="Supporters" className="text-primary-03" />
          <P2 text={`${tokenData.supporterCount}`} className="text-black" />
        </div>
        <div className="d-flex flex-column justify-content-between mt-3">
          <P2 bold text="Token Address" className="text-primary-03" />
          <P2
            text={token.contract_id || "Coming soon"}
            className="text-black"
          />
        </div>
      </div>
    </div>
  );
};

export default (props) => (
  <ApolloProvider client={client(props.railsContext.contractsEnv)}>
    <TokenDetails {...props} />
  </ApolloProvider>
);
