import React, { useMemo, useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { OnChain } from "src/onchain";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import PortfolioTable from "./PortfolioTable";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/10292/talent-protocol/v0.0.3",
  cache: new InMemoryCache(),
});

const GET_SPONSOR_PORTFOLIO = gql`
  query GetSponsorPortfolio($id: String!) {
    sponsor(id: $id) {
      id
      totalAmount
      talents {
        id
        amount
        talAmount
        talent {
          id
          symbol
          name
          totalSupply
          sponsorCounter
          owner
        }
      }
    }
  }
`;

const Portfolio = ({ address }) => {
  const { loading, error, data } = useQuery(GET_SPONSOR_PORTFOLIO, {
    variables: { id: address.toLowerCase() },
  });
  const [chainAPI, setChainAPI] = useState(null);

  const supportedTalents = useMemo(() => {
    console.log(data);
    console.log(address);

    if (!data) {
      return [];
    }

    return data.sponsor.talents.map(({ amount, talent }) => ({
      id: talent.owner,
      symbol: talent.symbol,
      name: talent.name,
      amount: ethers.utils.formatUnits(amount),
      totalSupply: ethers.utils.formatUnits(talent.totalSupply),
      nrOfSponsors: talent.sponsorCounter,
      contract_id: talent.id,
    }));
  }, [data]);

  const setupChain = useCallback(async () => {
    const newOnChain = new OnChain();

    await newOnChain.initialize();
    await newOnChain.loadStaking();

    setChainAPI(newOnChain);
  });

  useEffect(() => {
    setupChain();
  }, []);

  console.log(data);

  const loadReturns = async (contractAddress) => {
    if (chainAPI && contractAddress) {
      const value = await chainAPI.calculateEstimatedReturns(
        contractAddress,
        true
      );
      console.log(
        "STAKER REWARDS: ",
        ethers.utils.formatUnits(value.stakerRewards)
      );
      console.log(
        "TALENT REWARDS: ",
        ethers.utils.formatEther(value.talentRewards)
      );
      return ethers.utils.formatUnits(value.stakerRewards);
    }

    return "0";
  };

  return (
    <>
      <h2>Portfolio</h2>
      <PortfolioTable
        loading={loading}
        talents={supportedTalents}
        loadReturns={loadReturns}
      />
    </>
  );
};

export default (props) => (
  <ApolloProvider client={client}>
    <Portfolio {...props} />
  </ApolloProvider>
);
