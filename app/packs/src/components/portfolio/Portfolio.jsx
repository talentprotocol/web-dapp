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
import PortfolioTalOverview from "./PortfolioTalOverview";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/10292/talent-protocol/v0.0.11",
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

const Portfolio = ({ address, railsContext }) => {
  const [localAccount, setLocalAccount] = useState(address || "");
  const { loading, error, data, refetch } = useQuery(GET_SPONSOR_PORTFOLIO, {
    variables: { id: localAccount.toLowerCase() },
  });

  const [chainAPI, setChainAPI] = useState(null);
  const [stableBalance, setStableBalance] = useState(0);
  const [returnValues, setReturnValues] = useState({});

  const supportedTalents = useMemo(() => {
    if (!data || data.sponsor == null) {
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

  const amountInvested = useMemo(() => {
    if (!data || data.sponsor == null) {
      return 0;
    }

    return ethers.utils.formatUnits(
      data.sponsor.talents.reduce((prev, current) => {
        return prev.add(ethers.BigNumber.from(current.amount));
      }, ethers.BigNumber.from(0))
    );
  }, [data]);

  const setupChain = useCallback(async () => {
    const newOnChain = new OnChain(railsContext.railsEnv);

    await newOnChain.initialize();
    await newOnChain.loadStaking();
    await newOnChain.loadStableToken();
    const balance = await newOnChain.getStableBalance(true);

    if (balance) {
      setStableBalance(balance);
    }

    if (localAccount != "" && newOnChain.account) {
      setLocalAccount(newOnChain.account);
      refetch();
    }

    if (newOnChain) {
      setChainAPI(newOnChain);
    }
  });

  const updateAll = async () => {
    supportedTalents.forEach((element) => {
      loadReturns(element.contract_id).then((returns) => {
        setReturnValues((prev) => ({
          ...prev,
          [element.id]: returns,
        }));
      });
    });
  };

  const returnsSum = useMemo(() => {
    let sum = ethers.BigNumber.from(0);

    Object.keys(returnValues).map((key) => {
      sum = sum.add(ethers.utils.parseUnits(returnValues[key]));
    });
    return ethers.utils.formatUnits(sum);
  }, [returnValues]);

  useEffect(() => {
    updateAll();
  }, [supportedTalents, chainAPI]);

  useEffect(() => {
    setupChain();
  }, []);

  const loadReturns = async (contractAddress) => {
    if (chainAPI && contractAddress) {
      const value = await chainAPI.calculateEstimatedReturns(
        contractAddress,
        null
      );

      if (value?.stakerRewards) {
        return ethers.utils.formatUnits(value.stakerRewards);
      } else {
        return "0";
      }
    }

    return "0";
  };

  const claimRewards = async (contractAddress) => {
    if (chainAPI && contractAddress) {
      await chainAPI.claimRewards(contractAddress);
    }
  };

  return (
    <>
      <PortfolioTalOverview
        loading={loading}
        cUSDBalance={parseFloat(stableBalance)}
        totalTal={parseFloat(amountInvested)}
        yieldSum={parseFloat(returnsSum)}
        talentCount={supportedTalents.length}
      />
      <PortfolioTable
        loading={loading}
        talents={supportedTalents}
        returnValues={returnValues}
        unstake={() => null}
        withdraw={() => null}
        claim={claimRewards}
      />
    </>
  );
};

export default (props, railsContext) => {
  return () => (
    <ApolloProvider client={client}>
      <Portfolio {...props} railsContext={railsContext} />
    </ApolloProvider>
  );
};
