import React, { createContext, useState, useEffect, useCallback } from "react";

import { TalWeb3 } from "src/taljs";

const defaultValue = {
  tokens: {},
  talToken: {},
  balance: 0.0,
};

const Web3Context = createContext(defaultValue);
Web3Context.displayName = "Web3Context";

const Web3Container = (props) => {
  const [talweb3, setTalweb3] = useState(null);
  const [provider, setProvider] = useState(null);
  const [tokens, setTokens] = useState({});
  const [talToken, setTalToken] = useState({ balance: 0.0 });

  const setupTal = useCallback(async () => {
    let web3;
    if (talweb3 === null) {
      web3 = new TalWeb3();
      await web3.initialize();
    }

    const allTalentTokens = await web3.talentTokens.getAllTalentTokens();
    setTalweb3(web3);
    setProvider(web3.provider);
    setTokens(allTalentTokens);
    setTalToken(web3.tal);
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
    const allTokens = await talweb3.talentTokens.getAllTalentTokens(false);
    setTokens(allTokens);
  };

  const buy = async (address, amount) => {
    const desiredToken = await talweb3.talentTokens.getTalentToken(
      address,
      false
    );
    const transaction = await desiredToken.buy(
      talweb3.tal.contract._address,
      amount
    );

    await updateTalToken();
    await updateTokens();

    return transaction;
  };

  const sell = async (address, amount) => {
    const desiredToken = await talweb3.talentTokens.getTalentToken(
      address,
      false
    );

    const transaction = await desiredToken.sell(
      talweb3.tal.contract._address,
      amount
    );

    await updateTalToken();
    await updateTokens();

    return transaction;
  };

  const approve = async (address, amount) => {
    const approved = await talweb3.tal.approve(address, amount);

    return approved;
  };

  const transfer = async (address, amount) => {
    const result = await talweb3.tal.transfer(address, amount);

    return result;
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
  };

  return (
    <Web3Context.Provider value={value}>{props.children}</Web3Context.Provider>
  );
};

export { Web3Context };
export default Web3Container;
