import React, { useEffect, useCallback, useState } from 'react'

import { TalWeb3 } from 'src/taljs'

const PortfolioTalOverview = ({
  talAvailable,
  talCommited,
  talentCount,
  talTotalInUSD
}) => {
  const [tal, setTal] = useState(0)

  const setupTal = useCallback(async () => {
    const talweb3 = new TalWeb3()
    await talweb3.initialize()

    const balance = await talweb3.tal.balance()
    setTal(balance/100.0)

    // const newTalent = await talweb3.careerCoins.createNewCoin('FLEAL', 'Francisco Leal', 1, '0xD99350Cf7f102410A4849666CF130cFADD1113E3', 5)
    // console.log(newTalent)
    // ^^^reserved for owner account

    // const careerCoins = await talweb3.careerCoins.getAllCareerCoins()
    // console.log(careerCoins)
  }, [])

  useEffect(() => {
    setupTal()
  }, [setupTal])

  return (
    <div className="d-flex flex-row flex-wrap pt-3 pb-4 align-items-center">
      <div className="col-12 col-sm-6 col-md-3 mt-2 pr-1 pl-0">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted"><small>$TAL</small></div>
          <h4>{tal}</h4>
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-3 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted"><small>$TAL invested</small></div>
          <h4>{talCommited}</h4>
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-3 mt-2 px-1">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted"><small>$TAL Total (USD)</small></div>
          <h4>{talTotalInUSD}</h4>
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-3 mt-2 pl-1 pr-0">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted"><small>Talent supported</small></div>
          <h4>{talentCount}</h4>
        </div>
      </div>
    </div>
  )
}

export default PortfolioTalOverview