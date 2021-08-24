import { differenceInMinutes } from "date-fns";

import TalentTokenAbi from "../abis/CareerCoin.json";
import TalentToken from "./TalentToken";

const MASTER_ACCOUNT = "0xF9BB10F122722cCf86767490f33Dd74dd0B9C5F2";

class TalentTokens {
  constructor(
    contract,
    networkId,
    web3,
    account,
    master_account = MASTER_ACCOUNT
  ) {
    this.contract = contract;
    this.networkId = networkId;
    this.web3 = web3;
    this.lastUpdated = null;
    this.cache = {};
    this.master_account = master_account;
    this.account = account;
  }

  bustCache() {
    this.lastUpdated = null;
  }

  shouldRefreshCache() {
    return (
      this.lastUpdated === null ||
      differenceInMinutes(this.lastUpdated, new Date()) > 15
    );
  }

  async getAll() {
    if (this.shouldRefreshCache() && this.contract) {
      const talentList = await this.contract.methods.getTalentList().call();

      talentList.forEach(
        (talent) => (this.cache[talent] = { address: talent })
      );
      this.lastUpdated = new Date();
    }

    return this.cache;
  }

  async getAllAddresses() {
    const addresses = await this.getAll();

    return Object.keys(addresses);
  }

  async getAllTalentTokens(useCache = true) {
    const allAddresses = await this.getAllAddresses();

    for await (let address of allAddresses) {
      await this.getTalentToken(address, useCache);
    }

    return await this.getAll();
  }

  async getTalentToken(address, useCache = true) {
    const talents = await this.getAll();

    if (talents[address]) {
      if (talents[address].talentToken && useCache) {
        return talents[address].talentToken;
      } else {
        const token = new TalentToken(
          new this.web3.eth.Contract(TalentTokenAbi.abi, address),
          this.networkId,
          this.master_account,
          this.account
        );
        await token.load();

        this.cache[address].name = token.name;
        this.cache[address].symbol = token.symbol;
        this.cache[address].balance = token.balance;
        this.cache[address].circulatingSupply = token.mintedTokens;
        this.cache[address].dollarPerToken = token.tokenValue;

        return token;
      }
    }
  }

  async createNewToken(ticker, name, reserveRatio, talentAddress, talentFee) {
    const result = await this.contract.methods
      .instanceNewTalent(ticker, name, reserveRatio, talentAddress, talentFee)
      .send({ from: MASTER_ACCOUNT });
    if (result === true) {
      await this.getTalentToken(talentAddress);
    }
    return result;
  }
}

export default TalentTokens;
