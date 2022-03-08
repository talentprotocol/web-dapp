import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import currency from "currency.js";
import { OnChain } from "src/onchain";

import CeloImage from "images/celo.png";
import MetamaskFox from "images/metamask-fox.svg";

import { H4, P2 } from "src/components/design_system/typography";
import { Copy } from "src/components/icons";
import Button from "src/components/design_system/button";
import Tooltip from "src/components/design_system/tooltip";

import {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO_FOR_ID_SIMPLE,
  client,
} from "src/utils/thegraph";

const SimpleTokenDetails = ({ token, ticker, mode, railsContext }) => {
  const { loading, data } = useQuery(GET_TALENT_PORTFOLIO_FOR_ID_SIMPLE, {
    variables: { id: token?.contract_id?.toLowerCase() },
  });

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

  const formatNumberWithSymbol = (value) => currency(value).format();

  const formatNumberWithoutSymbol = (value) =>
    currency(value, { symbol: "" }).format();

  const copyTokenAdddres = () =>
    navigator.clipboard.writeText(token.contract_id);

  const addTokenToMetamask = async () => {
    const onChainAPI = new OnChain(railsContext.contractsEnv);

    await onChainAPI.addTokenToWallet(token.contract_id, token.ticker);
  };

  return (
    <>
      <div className="card disabled d-flex flex-column align-items-center justify-content-center mb-4 p-3">
        <P2 className="mb-2 text-primary-04" bold text="Market Value" />
        <H4 bold text={formatNumberWithSymbol(tokenData.totalSupply * 0.1)} />
      </div>
      <div className="card disabled d-flex flex-column align-items-center justify-content-center mb-4 p-3">
        <P2 className="mb-2 text-primary-04" bold text="Circulating Supply" />
        <H4
          bold
          text={`${formatNumberWithoutSymbol(tokenData.totalSupply)} ${ticker}`}
        />
      </div>
      <div className="card disabled d-flex flex-column align-items-center justify-content-center mb-4 p-3">
        <P2 className="mb-2 text-primary-04" bold text="Supporters" />
        <H4 bold text={`${tokenData.supporterCount}`} />
      </div>
      {token.contract_id && (
        <div className="card card-no-hover d-flex flex-column align-items-center justify-content-center p-3">
          <P2 className="mb-2 text-primary-04" bold text="Contract" />
          <div className="d-flex flex-row justify-content-center align-items-center">
            <img
              src={CeloImage}
              className="mr-1"
              width="16"
              height="16"
              alt="celo-logo"
            />
            <P2 text="Celo:" className="mr-1" />
            <P2
              bold
              className="text-black"
              text={`${token.contract_id.substring(0, 10)}...`}
            />
            <Tooltip
              body={"Copied!"}
              popOverAccessibilityId={"coppy_address_success"}
              mode={mode}
              placement="top"
            >
              <Button
                type="white-subtle"
                mode={mode}
                className="ml-2"
                onClick={copyTokenAdddres}
              >
                <Copy color="currentColor" />
              </Button>
            </Tooltip>
            <Button
              type="white-subtle"
              mode={mode}
              className="ml-2"
              onClick={addTokenToMetamask}
            >
              <img
                src={MetamaskFox}
                width={16}
                height={16}
                alt="Metamask Fox"
              />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default (props) => (
  <ApolloProvider client={client(props.railsContext.contractsEnv)}>
    <SimpleTokenDetails {...props} />
  </ApolloProvider>
);
