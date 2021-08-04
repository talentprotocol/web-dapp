import { differenceInMinutes } from 'date-fns'

import CareerCoinAbi from '../abis/CareerCoin.json'
import CareerCoin from './CareerCoin'

const MASTER_ACCOUNT = "0xf6F2dF72F234e67c468B8aE5bCD983D984de9C55"

class CareerCoins {
  constructor(contract, networkId, web3, master_account) {
    this.contract = contract
    this.networkId = networkId
    this.web3 = web3
    this.cache = { lastUpdated: null }
    this.master_account = master_account ? master_account : MASTER_ACCOUNT
  }

  bustCache() {
    this.cache.lastUpdated = null
  }

  shouldRefreshCache() {
    return this.cache.lastUpdated === null || differenceInMinutes(this.cache.lastUpdated, new Date()) > 15
  }

  async getAll() {
    if (this.shouldRefreshCache()) {
      const talentList = await this.contract.methods.getTalentList().call()

      talentList.forEach((talent) => (this.cache[talent] = { address: talent }))
      this.cache.lastUpdated = new Date()
    }

    return this.cache
  }

  async getAllAddresses() {
    const {lastUpdated, ...addresses } = await this.getAll()

    return Object.keys(addresses)
  }

  async getAllCareerCoins(useCache = true) {
    const allAddresses = await this.getAllAddresses()
    
    allAddresses.forEach(async (address) => {
      const coin = await this.getCareerCoin(address, useCache)
      coin.load()
    })

    return this.getAll()
  }

  async getCareerCoin(address, useCache = true) {
    const talents = await this.getAll()

    if(talents[address]) {
      if (talents[address].careerCoin && useCache) {
        return talents[address].careerCoin
      } else {
        talents[address].careerCoin = new CareerCoin(new this.web3.eth.Contract(CareerCoinAbi.abi, address), this.networkId)
        return talents[address].careerCoin
      }
    }
  }

  async createNewCoin(ticker, name, reserveRatio, talentAddress, talentFee) {
    const result = await this.contract.methods.instanceNewTalent(ticker, name, reserveRatio, talentAddress, talentFee).send({ from: MASTER_ACCOUNT })
    if(result === true) {
      await this.getCareerCoin(talentAddress)
    }
    return result
  }
}

export default CareerCoins
