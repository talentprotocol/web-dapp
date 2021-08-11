import React, { useState, useCallback, useEffect} from 'react'

import { TalWeb3 } from 'src/taljs'
import { patch } from 'src/utils/requests'

import Button from "../button"

const DeployCoinButton = ({ ticker, username, address, reserveRatio, talentFee, updateCoinUrl, contract_id}) => {
  const [buttonText, setButtonText] = useState("Deploy Coin")
  const [mintText, setMintText] = useState("Initial Mint")
  const [tokenAddress, setTokenAddress] = useState(contract_id)
  const [talweb3, setTalweb3] = useState()

  const setupTal = useCallback(async () => {
    const web3 = new TalWeb3()
    await web3.initialize()
    setTalweb3(web3)
  }, [])

  useEffect(() => {
    setupTal()
  }, [setupTal])

  const onClick = async (e) => {
    e.preventDefault()

    setButtonText("Deploying Coin..")

    const result = await talweb3.careerCoins.createNewCoin(ticker, username, reserveRatio, address, talentFee)
    if (result) {
      const contractAddress = result.events.TalentAdded.returnValues.contractAddress
      setTokenAddress(contractAddress)

      const response = await patch(`${updateCoinUrl}.json`,
        { coin: { contract_id: contractAddress, deployed: true }
      })
      if (response.error) {
        setButtonText("Error updating contract ID")
      } else {
        setButtonText("Deployed Coin")
      }
    } else {
      setButtonText("Unable to create new talent coin")
    }
  }

  const performInitialMint = async (e) => {
    e.preventDefault()

    const token = await talweb3.careerCoins.getCareerCoin(tokenAddress, false)
    if (token) {
      const result = await token.initialMint()

      if (result) {
        setMintText("Minted token")
      } else {
        setMintText("Unabled to mint")
      }
    } else {
      setMintText("Token doesn't exist")
    }
  }

  return (
    <>
      <Button disabled={buttonText != "Deploy Coin"} type="warning" text={buttonText} onClick={onClick}/>
      <Button disabled={tokenAddress != "" && mintText != "Initial Mint"} type="danger" text={mintText} onClick={performInitialMint}/>
    </>
  )
}

export default DeployCoinButton
