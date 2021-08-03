import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'

const loadWeb3 = async() => {
  const provider = await detectEthereumProvider({ mustBeMetaMask: true })

  if (provider) {
    window.web3 = new Web3(provider)
  }
  else if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    return false
  }

  return true
}

export {
  loadWeb3
}