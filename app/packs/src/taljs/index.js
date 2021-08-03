import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import TalentProtocol from '../abis/TalentProtocol.json'
import Tal from './Tal'

const TAL_ADDRESSES = {
  3: "0x48f6d99fac2af7ad7b580b6cb6edbe0373dd51f5", // ropsten
}

const LOCAL_TAL_ADDRESS = "0x96465668B947CC7c0FD39A3ad35320316B6CadF9" // local fallback from ABIs

class TalWeb3 {
  constructor() {
    this.web3 = null
    this.account = null
    this.networkId = null
    this.tal = null
  }

  async initialize() {
    await this.loadWeb3()
    await this.loadAccount()
    await this.loadNetworkId()
    await this.loadTal()
  }

  async loadAccount() {
    const accounts = await this.web3.eth.getAccounts()
    this.account = accounts[0]
  }

  async loadNetworkId() {
    this.networkId = await this.web3.eth.net.getId()
  }

  async loadTal() {
    let address
    if(TalentProtocol.networks) {
      const talentProtocolTokenData = TalentProtocol.networks[this.networkId]
      if (talentProtocolTokenData) {
        address = talentProtocolTokenData.address
      }
    } else {
      if (TAL_ADDRESSES[this.networkId]){
        address = TAL_ADDRESSES[this.networkId]
      } else {
        address = LOCAL_TAL_ADDRESS
      }
    }

    if (address) {
      const contract = new this.web3.eth.Contract(TalentProtocol.abi, address)
      this.tal = new Tal(contract, this.account, this.networkId)
    } else {
      this.tal = new Tal(null, null, null)
      window.alert('Talent Protocol contract not deployed to detected network.')
    }
  }

  async loadWeb3() {
    const provider = await detectEthereumProvider({ mustBeMetaMask: true })

    if (provider) {
      this.web3 = new Web3(provider)
    }
    else if (window.ethereum) {
      this.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      return false
    }
    return true
  }

  tal() {
    return this.tal
  }
}

export {
  TalWeb3
}
