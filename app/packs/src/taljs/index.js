import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import TalentProtocol from '../abis/TalentProtocol.json'
import Tal from './Tal'

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
    const talentProtocolTokenData = TalentProtocol.networks[this.networkId]
    if (talentProtocolTokenData) {
      const contract = new this.web3.eth.Contract(TalentProtocol.abi, talentProtocolTokenData.address)
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
