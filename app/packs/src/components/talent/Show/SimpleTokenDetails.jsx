import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import currency from "currency.js";

import { H4, P2 } from "src/components/design_system/typography";

import {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO_FOR_ID_SIMPLE,
  client,
} from "src/utils/thegraph";

const SimpleTokenDetails = ({ token, ticker }) => {
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

  return (
    <>
      <div className="card disabled d-flex flex-column align-items-center justify-content-center mb-5">
        <P2 className="mb-2 text-primary-04" bold text="Market Value" />
        <H4 bold text={formatNumberWithSymbol(tokenData.totalSupply * 0.1)} />
      </div>
      <div className="card disabled d-flex flex-column align-items-center justify-content-center mb-5">
        <P2 className="mb-2 text-primary-04" bold text="Circulating Supply" />
        <H4
          bold
          text={`${formatNumberWithoutSymbol(tokenData.totalSupply)} ${ticker}`}
        />
      </div>
      <div className="card disabled d-flex flex-column align-items-center justify-content-center">
        <P2 className="mb-2 text-primary-04" bold text="Supporters" />
        <H4 bold text={tokenData.supporterCount} />
      </div>
    </>
  );
};

export default (props) => (
  <ApolloProvider client={client(props.railsContext.contractsEnv)}>
    <SimpleTokenDetails {...props} />
  </ApolloProvider>
);
