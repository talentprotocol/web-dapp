import React, { createContext, useState, useEffect, useCallback } from "react";

import { TalWeb3 } from "src/taljs";

const defaultValue = {
  tokens: {},
  talToken: {},
  balance: 0.0,
};

const networks = {
  ropsten: 3,
};

const Web3Context = createContext(defaultValue);
Web3Context.displayName = "Web3Context";

const Web3Container = (props) => {
  const [talweb3, setTalweb3] = useState(null);
  const [provider, setProvider] = useState(null);
  const [tokens, setTokens] = useState({});
  const [talToken, setTalToken] = useState({ balance: 0.0, price: 0.02 });
  const [loading, setLoading] = useState(true);

  const validNetwork = (web3) => {
    if (window.location.href.includes("localhost")) {
      return true;
    }

    return web3.provider != null && web3.networkId == networks["ropsten"];
  };

  const setupTal = useCallback(async () => {
    let web3;
    if (talweb3 === null) {
      web3 = new TalWeb3();
      await web3.initialize();
    }

    web3.provider.on("chainChanged", () => window.location.reload());
    web3.provider.on("accountsChanged", () => window.location.reload());

    if (!validNetwork(web3)) {
      return await web3.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x3" }],
      });
    }

    if (web3.talentTokens && !props.ignoreTokens) {
      const allTalentTokens = await web3.talentTokens.getAllTalentTokens();
      setTokens(allTalentTokens);
    }

    setTalweb3(web3);
    setProvider(web3.provider);
    setTalToken(web3.tal);
    setLoading(false);
  }, []);

  useEffect(() => {
    setupTal();
  }, [setupTal]);

  const updateTalToken = async () => {
    await talweb3.loadTal();
    setTalToken(talweb3.tal);
  };

  const updateTokens = async () => {
    await talweb3.loadTalentTokens();
    if (talweb3.talentTokens) {
      const allTokens = await talweb3.talentTokens.getAllTalentTokens(false);
      setTokens(allTokens);
    }
  };

  const buy = async (
    address,
    amount,
    onSuccess,
    onError = () => {},
    onTransactionHash = () => {}
  ) => {
    if (!talweb3.talentTokens) {
      return 0;
    }
    const desiredToken = await talweb3.talentTokens.getTalentToken(
      address,
      false
    );

    const rewardAmount = await desiredToken.buy(
      amount,
      onSuccess,
      onError,
      onTransactionHash
    );

    await updateTalToken();
    await updateTokens();

    return rewardAmount;
  };

  const simulateBuy = async (address, amount) => {
    if (!talweb3.talentTokens) {
      return 0;
    }
    const desiredToken = await talweb3.talentTokens.getTalentToken(
      address,
      false
    );

    const estimatedAmount = await desiredToken.simulateBuy(amount);

    return estimatedAmount;
  };

  const sell = async (
    address,
    amount,
    onSuccess,
    onError = () => {},
    onTransactionHash = () => {}
  ) => {
    if (!talweb3.talentTokens) {
      return 0;
    }
    const desiredToken = await talweb3.talentTokens.getTalentToken(
      address,
      false
    );

    const transaction = await desiredToken.sell(
      amount,
      onSuccess,
      onError,
      onTransactionHash
    );

    await updateTalToken();
    await updateTokens();

    return transaction;
  };

  const simulateSell = async (address, amount) => {
    if (!talweb3.talentTokens) {
      return 0;
    }
    if (amount == 0 || amount == 0.0) {
      return 0;
    }

    const desiredToken = await talweb3.talentTokens.getTalentToken(
      address,
      false
    );

    const estimatedAmount = await desiredToken.simulateSell(amount);

    return estimatedAmount;
  };

  const approve = async (address, amount) => {
    if (!talweb3.tal) {
      return false;
    }

    const approved = await talweb3.tal.approve(address, amount);

    return approved;
  };

  const transfer = async (address, amount) => {
    if (!talweb3.tal) {
      return 0;
    }
    const result = await talweb3.tal.transfer(address, amount);

    return result;
  };

  const toWei = (amount) => {
    if (talweb3 == null) {
      return 0;
    } else {
      return talweb3.toWei(amount);
    }
  };

  const value = {
    ...defaultValue,
    talToken,
    tokens,
    provider,
    buy,
    sell,
    approve,
    transfer,
    simulateSell,
    simulateBuy,
    toWei,
    loading,
    networkId: talweb3?.networkId,
  };

  return (
    <Web3Context.Provider value={value}>{props.children}</Web3Context.Provider>
  );
};

export { Web3Context };
export default Web3Container;
