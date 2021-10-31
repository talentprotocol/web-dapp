import React, { useMemo, useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { OnChain } from "src/onchain";

import {
  ApolloProvider,
  useQuery,
  GET_SUPPORTER_PORTFOLIO,
  client,
} from "src/utils/thegraph";

import PortfolioTable from "./PortfolioTable";
import PortfolioTalOverview from "./PortfolioTalOverview";

const Portfolio = ({ address, railsContext }) => {
  const [localAccount, setLocalAccount] = useState(address || "");
  const { loading, error, data, refetch } = useQuery(GET_SUPPORTER_PORTFOLIO, {
    variables: { id: localAccount.toLowerCase() },
  });

  const [chainAPI, setChainAPI] = useState(null);
  const [stableBalance, setStableBalance] = useState(0);
  const [returnValues, setReturnValues] = useState({});

  const supportedTalents = useMemo(() => {
    if (!data || data.supporter == null) {
      return [];
    }

    return data.supporter.talents.map(({ amount, talent }) => ({
      id: talent.owner,
      symbol: talent.symbol,
      name: talent.name,
      amount: ethers.utils.formatUnits(amount),
      totalSupply: ethers.utils.formatUnits(talent.totalSupply),
      nrOfSupporters: talent.supporterCounter,
      contract_id: talent.id,
    }));
  }, [data]);

  const setupChain = useCallback(async () => {
    const newOnChain = new OnChain(railsContext.contractsEnv);

    await newOnChain.connectedAccount();
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
          [element.contract_id]: returns,
        }));
      });
    });
  };

  const talentTokensSum = useMemo(() => {
    let sum = ethers.BigNumber.from(0);

    supportedTalents.map((talent) => {
      sum = sum.add(ethers.utils.parseUnits(talent.amount));
    });
    return ethers.utils.formatUnits(sum);
  }, [supportedTalents]);

  const yieldSum = useMemo(() => {
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
      if (!(await chainAPI.recognizedChain())) {
        await chainAPI.switchChain();
      } else {
        await chainAPI.claimRewards(contractAddress);
      }
    }
  };

  return (
    <>
      <PortfolioTalOverview
        cUSDBalance={parseFloat(stableBalance)}
        talentTokensTotal={parseFloat(talentTokensSum)}
        totalYield={parseFloat(yieldSum)}
      />
      <PortfolioTable
        loading={loading}
        talents={supportedTalents}
        returnValues={returnValues}
        unstake={() => null}
        claim={() => null}
        restake={claimRewards}
        // function names on contract are not correct
      />
    </>
  );
};

export default (props, railsContext) => {
  return () => (
    <ApolloProvider client={client(railsContext.contractsEnv)}>
      <Portfolio {...props} railsContext={railsContext} />
    </ApolloProvider>
  );
};
