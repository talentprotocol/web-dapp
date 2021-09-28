import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { newKit, CeloContract } from "@celo/contractkit";

import TalentToken from "../abis/recent/TalentToken.json";
import Staking from "../abis/recent/Staking.json";
import TalentFactory from "../abis/recent/TalentFactory.json";
import StableToken from "../abis/recent/StableToken.json";

class OnChain {
  constructor() {
    this.web3 = null;
    this.provider = null;
    this.account = null;
    this.networkId = null;
    this.talentFactory = null;
    this.staking = null;
    this.stabletoken = null;
    this.celoKit = null;
    this.tokenTest = null;
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
      "0x84b0086D0e356F2a98e4ab228E2a3473b2ea5A3d"
    );

    return true;
  }

  loadStaking() {
    this.staking = new this.web3.eth.Contract(
      Staking.abi,
      "0x3b034E5ff32d8475b3b041Ebb0EC4c0Cb851177c"
    );

    return true;
  }

  async loadStableToken() {
    this.celoKit = newKit("https://alfajores-forno.celo-testnet.org");

    const stableTokenAddress = await this.celoKit.registry.addressFor(
      CeloContract.StableToken
    );

    this.stabletoken = new this.web3.eth.Contract(
      StableToken.abi,
      stableTokenAddress
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
      .send({ from: this.account })
      .catch(() => false);

    return result;
  }

  getToken(address) {
    return new this.web3.eth.Contract(TalentToken.abi, address);
  }

  async getTokenFromTalent(address) {
    if (!this.talentFactory) {
      return;
    }

    const result = await this.talentFactory.methods
      .talentToToken(address)
      .call()
      .catch(() => false);

    return result;
  }

  async createStake(token, _amount, onSuccess, onError, onTransactionHash) {
    if (!this.staking) {
      return;
    }

    const amount = this.web3.utils.toWei(_amount.toString());

    console.log("STAKING ATTEMPT");
    console.log("AMOUNT: ", _amount);
    console.log("AMOUNT (wei): ", amount);
    console.log(
      "BALANCE OF ACCOUNT: ",
      await this.stabletoken.methods.balanceOf(this.account).call()
    );
    console.log(
      "ALLOWANCE OF STAKING CONTRACT: ",
      await this.stabletoken.methods
        .allowance(this.account, this.staking._address)
        .call()
    );

    const result = await this.staking.methods
      .stakeStable(token, amount)
      .send({ from: this.account, gas: "210000" })
      .on("transactionHash", (hash) => onTransactionHash(hash))
      .on("receipt", (receipt) => onSuccess(receipt))
      .on("error", (e) => onError(e));

    return result;
  }

  async approveStable(_amount) {
    if (!this.staking || !this.stabletoken) {
      return;
    }

    const amount = this.web3.utils.toWei(_amount.toString());

    const result = await this.stabletoken.methods
      .approve(this.staking._address, amount)
      .send({ from: this.account });

    return result;
  }

  async getStableBalance(formatted = false) {
    if (!this.stabletoken || !this.account) {
      return;
    }

    const result = await this.stabletoken.methods
      .balanceOf(this.account)
      .call();

    if (formatted) {
      return this.web3.utils.fromWei(result.toString());
    } else {
      return result;
    }
  }

  async maxPossibleStake(tokenAddress, formatted = false) {
    if (!this.staking) {
      return;
    }

    const result = await this.staking.methods
      .stakeAvailability(tokenAddress)
      .call();

    if (formatted) {
      return this.web3.utils.fromWei(result.toString());
    } else {
      return result;
    }
  }

  async getTokenAvailability(token, formatted = false) {
    if (!token) {
      return;
    }

    const result = await token.methods.mintingAvailability().call();

    if (formatted) {
      return this.web3.utils.fromWei(result.toString());
    } else {
      return result;
    }
  }
}

export { OnChain };
