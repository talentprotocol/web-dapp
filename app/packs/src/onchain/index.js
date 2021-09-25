import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

import TalentToken from "../abis/recent/TalentToken.json";
import Staking from "../abis/recent/Staking.json";
import TalentFactory from "../abis/recent/TalentFactory.json";

class OnChain {
  constructor() {
    this.web3 = null;
    this.provider = null;
    this.account = null;
    this.networkId = null;
    this.talentFactory = null;
  }

  async initialize() {
    const result = await this.loadWeb3();
    if (!result) return false;

    await this.loadAccount();
    await this.loadNetworkId();

    return true;
  }

  loadFactory() {
    this.talentFactory = new this.web3.eth.Contract(
      TalentFactory.abi,
      "0x8aFd8f844b92F8C97B806E3B50ebff25632a4CB5"
    );

    return true;
  }

  async loadAccount() {
    const accounts = await this.web3.eth.getAccounts();
    this.account = accounts[0];

    return this.account;
  }

  async loadNetworkId() {
    this.networkId = await this.web3.eth.net.getId();

    return this.networkId;
  }

  async loadWeb3() {
    const provider = await detectEthereumProvider();

    if (provider) {
      this.provider = provider;
      this.web3 = new Web3(provider);
    } else if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
      return false;
    }
    return true;
  }

  // Creates a new talent token
  async createTalent(name, symbol) {
    if (!this.talentFactory) {
      return;
    }

    const result = await this.talentFactory.methods
      .createTalent(this.account, name, symbol)
      .send({ from: this.account });

    return result;
  }

  getToken(address) {
    return new this.web3.eth.Contract(TalentToken.abi, address);
  }
}

export { OnChain };
