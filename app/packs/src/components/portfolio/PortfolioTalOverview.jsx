import React, { useContext } from 'react'

import Web3Container, { Web3Context } from 'src/contexts/web3Context'

const PortfolioTalOverview = ({
  talAvailable,
  talCommited,
  talentCount,
  talTotalInUSD
}) => {
  const web3 = useContext(Web3Context)

  return (
    <div className="d-flex flex-row flex-wrap pt-3 pb-4 align-items-center">
      <div className="col-12 col-sm-6 col-md-3 mt-2 pr-1 pl-0">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted"><small>$TAL</small></div>
          <h4>{web3.balance}</h4>
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

const ConnectedOverview = (props) => (
  <Web3Container>
    <PortfolioTalOverview {...props} />
  </Web3Container>
)

export default ConnectedOverview