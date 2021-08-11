import { differenceInMinutes } from 'date-fns'

import CareerCoinAbi from '../abis/CareerCoin.json'
import CareerCoin from './CareerCoin'

const MASTER_ACCOUNT = "0xf6F2dF72F234e67c468B8aE5bCD983D984de9C55"

class CareerCoins {
  constructor(contract, networkId, web3, account, master_account = MASTER_ACCOUNT) {
    this.contract = contract
    this.networkId = networkId
    this.web3 = web3
    this.lastUpdated = null
    this.cache = { }
    this.master_account = master_account
    this.account = account
  }

  bustCache() {
    this.lastUpdated = null
  }

  shouldRefreshCache() {
    return this.lastUpdated === null || differenceInMinutes(this.lastUpdated, new Date()) > 15
  }

  async getAll() {
    if (this.shouldRefreshCache()) {
      const talentList = await this.contract.methods.getTalentList().call()

      talentList.forEach((talent) => (this.cache[talent] = { address: talent }))
      this.lastUpdated = new Date()
    }

    return this.cache
  }

  async getAllAddresses() {
    const addresses = await this.getAll()

    return Object.keys(addresses)
  }

  async getAllCareerCoins(useCache = true) {
    const allAddresses = await this.getAllAddresses()

    for await (let address of allAddresses) {
      await this.getCareerCoin(address, useCache)
    }

    return await this.getAll()
  }

  async getCareerCoin(address, useCache = true) {
    const talents = await this.getAll()

    if(talents[address]) {
      if (talents[address].careerCoin && useCache) {
        return talents[address].careerCoin
      } else {
        const token = new CareerCoin(new this.web3.eth.Contract(CareerCoinAbi.abi, address), this.networkId, this.master_account, this.account)
        await token.load()

        this.cache[address].name = token.name
        this.cache[address].symbol = token.symbol
        this.cache[address].balance = token.balance

        return token
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
