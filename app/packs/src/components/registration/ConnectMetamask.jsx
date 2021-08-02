import React, { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'

import MetamaskFox from "images/metamask-fox.svg"

import {
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


const NoMetamask = () => (
  <div className="d-flex flex-row text-danger align-items-center">
    <FontAwesomeIcon icon={faTimes}/>
    <p className="ml-2 mb-0">You need metamask to be able to login.</p>
  </div>
)

const ConnectMetamask = ({ metamaskSubmit, changeStep }) => {
  const [provider, setProvider] = useState(null)
  const [requestingMetamask, setRequestingMetamask] = useState("false")
  const [showErrorMessage, setShowErrorMessage] = useState(false)

  useEffect(() => {
    detectEthereumProvider({ mustBeMetaMask: true })
      .then((metamaskProvider) =>{
        if (metamaskProvider) {
          setProvider(metamaskProvider)
        } else {
          setShowErrorMessage(true)
        }
      })
  })

  const connectMetamask = (e) => {
    e.preventDefault()

    setRequestingMetamask("true")
    if(provider) {
      provider.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          if (accounts.length > 0){
            metamaskSubmit(accounts[0])
            setRequestingMetamask("false")
            changeStep(6)
          }
        })
    }
  }

  const allowConnect = () => {
    requestingMetamask == "false" && provider != null
  }

  return (
    <div className="d-flex flex-column" style={{ maxWidth: 400 }}>
      <h6 className="registration_step_subtitle">Step 4 of 4</h6>
      <h1>Connect Metamask</h1>
      <p>All that's left is to connect your metamask to your account.</p>
      {provider == null && showErrorMessage && <NoMetamask />}
      <form onSubmit={connectMetamask} className="d-flex flex-column">
        <button disable={allowConnect()} type="submit" className="ml-2 btn btn-primary talent-button">Connect <img src={MetamaskFox} height={32} alt="Metamask Fox" /></button>
      </form>
    </div>
  )
}

export default ConnectMetamask