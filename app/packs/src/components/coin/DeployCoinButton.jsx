import React, { useCallback, useEffect} from 'react'
import { TalWeb3 } from 'src/taljs'
import Button from "../button"

const DeployCoinButton = ({ ticker, username, address, reserveRation, talentFee}) => {
  const setupTal = useCallback(async () => {
    const talweb3 = new TalWeb3()
    await talweb3.initialize()
  }, [])

  useEffect(() => {
    setupTal()
  }, [setupTal])

  onClick = (e) => {
    e.preventDefault()

    const newTalent = await talweb3.careerCoins.createNewCoin(ticker, username, reserveRation, address, talentFee)

    console.log(newTalent)
  }

  return (
    <Button type="warning" text="Deploy Coin" onClick={onClick}/>
  )
}

export default DeployCoinButton
