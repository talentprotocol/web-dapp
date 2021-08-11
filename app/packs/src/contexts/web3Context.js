import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react'

import { TalWeb3 } from 'src/taljs'

const defaultValue = {
  tokens: {},
  talToken: {},
  balance: 0.0,
}

const Web3Context = createContext(defaultValue);
Web3Context.displayName = "Web3Context"

const Web3Container = (props) => {
  const [talweb3, setTalweb3] = useState(null)
  const [tokens, setTokens] = useState({})
  const [talToken, setTalToken] = useState({})

  const setupTal = useCallback(async () => {
    let web3
    if (talweb3 === null) {
      web3 = new TalWeb3()
      await web3.initialize()
    }
    
    const allTalentTokens = await web3.careerCoins.getAllCareerCoins()
    setTalweb3(web3)
    setTokens(allTalentTokens)
    setTalToken(web3.tal)
  }, [])

  useEffect(() => {
    setupTal()
  }, [setupTal])

  const updateTalToken = async() => {
    await talweb3.loadTal()
    setTalToken(talweb3.tal)
  }

  const updateTokens = async() => {
    await talweb3.loadCareerCoins()
    const allTokens = await talweb3.careerCoins.getAllCareerCoins(false)
    setTokens(allTokens)
  }

  const buy = async (address, amount) => {
    const desiredToken = await talweb3.careerCoins.getCareerCoin(address, false)
    const mintedAmount = await desiredToken.buy(talweb3.tal.contract._address, amount)

    await updateTalToken()
    await updateTokens()

    return mintedAmount
  }

  const sell = async (address, amount) => {
    const desiredToken = await talweb3.careerCoins.getCareerCoin(address, false)

    const burnedAmount = await desiredToken.sell(talweb3.tal.contract._address, amount)

    await updateTalToken()
    await updateTokens()

    return burnedAmount
  }

  const approve = async (address, amount) => {
    const approved = await talweb3.tal.approve(address, amount)

    return approved
  }

  const value = {
    ...defaultValue,
    talToken,
    tokens,
    buy,
    sell,
    approve
  }

  return (
    <Web3Context.Provider value={value}>
      {props.children}
    </Web3Context.Provider>
  )
}

export {
  Web3Context
}
export default Web3Container;
