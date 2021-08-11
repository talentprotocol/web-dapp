import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'

import TalentProtocol from '../abis/TalentProtocol.json'
import TalentProtocolFactory from '../abis/TalentProtocolFactory.json'

import Tal from './Tal'
import CareerCoins from './CareerCoins'

const TAL_ADDRESSES = {
  3: "0x48f6d99fac2af7ad7b580b6cb6edbe0373dd51f5", // ropsten
}
const LOCAL_TAL_ADDRESS = "0x96465668B947CC7c0FD39A3ad35320316B6CadF9" // local fallback from ABIs

const CAREER_COINS_ADDRESSES = {}
const LOCAL_CAREER_COINS_ADDRESS =  "0xF5746B6243349FBE31fdF64474E36C0dF62790E9" // local fallback from ABIs

class TalWeb3 {
  constructor() {
    this.web3 = null
    this.account = null
    this.networkId = null
    this.tal = null
    this.careerCoins = null
  }

  async initialize() {
    await this.loadWeb3()
    await this.loadAccount()
    await this.loadNetworkId()
    await this.loadTal()
    await this.loadCareerCoins()
  }

  async loadAccount() {
    const accounts = await this.web3.eth.getAccounts()
    this.account = accounts[0]

    return this.account
  }

  async loadNetworkId() {
    this.networkId = await this.web3.eth.net.getId()

    return this.networkId
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
      await this.tal.getBalance()
    } else {
      this.tal = new Tal(null, null, null)
      window.alert('Talent Protocol contract not deployed to detected network.')
    }

    return this.tal
  }

  async loadCareerCoins() {
    let address
    if(TalentProtocolFactory.networks) {
      const talentProtocolFactoryData = TalentProtocolFactory.networks[this.networkId]
      if (talentProtocolFactoryData) {
        address = talentProtocolFactoryData.address
      }
    } else {
      if (CAREER_COINS_ADDRESSES[this.networkId]){
        address = CAREER_COINS_ADDRESSES[this.networkId]
      } else {
        address = LOCAL_CAREER_COINS_ADDRESS
      }
    }

    if (address) {
      const contract = new this.web3.eth.Contract(TalentProtocolFactory.abi, address)
      this.careerCoins = new CareerCoins(contract, this.networkId, this.web3, this.account)
    } else {
      this.careerCoins = new CareerCoins(null, null, this.web3, this.account)
      window.alert('Talent Protocol Factory contract not deployed to detected network.')
    }

    return this.careerCoins
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
}

export {
  TalWeb3
}
