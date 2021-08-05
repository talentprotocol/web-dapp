import React, { useState, useCallback, useEffect} from 'react'

import { TalWeb3 } from 'src/taljs'
import { patch } from 'src/utils/requests'

import Button from "../button"

const DeployCoinButton = ({ ticker, username, address, reserveRatio, talentFee, updateCoinUrl}) => {
  const [buttonText, setButtonText] = useState("Deploy Coin")
  let talweb3

  const setupTal = useCallback(async () => {
    talweb3 = new TalWeb3()
    await talweb3.initialize()
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

  return (
    <Button disabled={buttonText != "Deploy Coin"} type="warning" text={buttonText} onClick={onClick}/>
  )
}

export default DeployCoinButton
