import React, { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import MetamaskFox from "images/metamask-fox.svg"
import { post } from "../../utils/requests"

const MetamaskLogin = ({ }) => {
  const [provider, setProvider] = useState(null)
  const [requestingMetamask, setRequestingMetamask] = useState("false")

  useEffect(() => {
    detectEthereumProvider({ mustBeMetaMask: true })
      .then((metamaskProvider) =>{
        if (metamaskProvider) {
          setProvider(metamaskProvider)
        }
      })
  })

  const loginWithMetamask = (e) => {
    e.preventDefault()

    setRequestingMetamask("true")
    if(provider) {
      provider.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          if (accounts.length > 0){            
            return provider
              .request({
                method: 'personal_sign',
                params: [accounts[0], "We use signatures to authenticate you. Sign this to give us proof that you have access to the address you want to use."]
              })
              .then((result) => {
                return post(
                  "/session",
                  { signed_message: result, wallet_id: accounts[0] }
                ).then((response) => {
                  if (response.success) {
                    window.location.href = response.success
                  }
                  setRequestingMetamask("false")
                })
              })
          }
        })
    }
  }

  const allowConnect = () => {
    requestingMetamask == "false" && provider != null
  }

  const buttonText = requestingMetamask == "false" ? "Log in" : "Logging in.."

  return (
    <form onSubmit={loginWithMetamask} className="d-flex flex-column">
      <button disable={allowConnect()} type="submit" className="btn btn-primary talent-button">{buttonText} <img src={MetamaskFox} height={32} alt="Metamask Fox" /></button>
    </form>
  )
}

export default MetamaskLogin