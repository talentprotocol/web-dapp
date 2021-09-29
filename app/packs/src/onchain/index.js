import { ethers } from "ethers";
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
    this.signer = null;
  }

  async initialize() {
    const result = await this.loadWeb3();
    if (!result) return false;

    await this.loadAccount();

    return true;
  }

  loadFactory() {
    this.talentFactory = new ethers.Contract(
      "0xcF2b5dd4367B083d495Cfc4332b0970464ee1472",
      TalentFactory.abi,
      this.provider
    );

    return true;
  }

  loadStaking() {
    this.staking = new ethers.Contract(
      "0xaAe247516e1e8C9744cE2de6C4dFef282FCf5753",
      Staking.abi,
      this.provider
    );

    return true;
  }

  async loadStableToken() {
    this.celoKit = newKit("https://alfajores-forno.celo-testnet.org");

    const stableTokenAddress = await this.celoKit.registry.addressFor(
      CeloContract.StableToken
    );

    console.log("StableToken: ", stableTokenAddress);

    this.stabletoken = new ethers.Contract(
      stableTokenAddress,
      StableToken.abi,
      this.provider
    );

    return true;
  }

  async loadAccount() {
    this.signer = this.provider.getSigner();

    if (this.signer) {
      this.account = await this.signer
        .getAddress()
        .catch(() => console.log("Wallet not connected."));
    }

    return this.account;
  }

  async connect() {
    await this.provider.send("eth_requestAccounts");

    return await this.loadAccount();
  }

  async loadWeb3() {
    if (window.ethereum) {
      // below is what is required to load accounts (the connect button)
      // const result = await window.ethereum.send("eth_requestAccounts");
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    } else if (window.web3) {
      this.provider = new ethers.providers.Web3Provider(
        window.web3.currentProvider
      );
    } else {
      // Add fallback to infura
      // const provider = new ethers.providers.JsonRpcProvider();
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
      return false;
    }
    return true;
  }

  async createTalent(name, symbol) {
    if (!this.talentFactory) {
      return;
    }

    console.log("NAME: ", name);
    console.log("SYMBOL: ", symbol);
    console.log("SIGNER: ", this.signer);
    console.log("ACCOUNT: ", this.account);

    const tx = await this.talentFactory
      .connect(this.signer)
      .createTalent(this.account, name, symbol);

    console.log("TX: ", tx);
    const receipt = await tx.wait();
    console.log("RECEIPT: ", receipt);

    const event = receipt.events?.find((e) => {
      return e.event === "TalentCreated";
    });
    console.log("EVENT: ", event);

    return event;
  }

  async calculateEstimatedReturns(token) {
    if (!this.staking) {
      return;
    }

    const timestamp = Math.floor(new Date().getTime() / 1000);

    const result = await this.staking.calculateEstimatedReturns(
      this.account,
      token,
      timestamp
    );

    return result;
  }

  getToken(address) {
    return new ethers.Contract(address, TalentToken.abi, this.provider);
  }

  async createStake(token, _amount) {
    if (!this.staking) {
      return;
    }

    const amount = ethers.utils.parseUnits(_amount);

    console.log("STAKING ATTEMPT");
    console.log("AMOUNT: ", _amount);
    console.log("TOKEN: ", token);
    console.log("AMOUNT (wei): ", amount);
    console.log(
      "BALANCE OF ACCOUNT: ",
      ethers.utils.formatUnits(await this.stabletoken.balanceOf(this.account))
    );
    console.log(
      "ALLOWANCE OF STAKING CONTRACT: ",
      ethers.utils.formatUnits(
        await this.stabletoken.allowance(this.account, this.staking.address)
      )
    );

    const tx = await this.staking
      .connect(this.signer)
      .stakeStable(token, amount);
    console.log("RESULT: ", result);

    const receipt = await tx.wait();
    console.log("RECEIPT: ", receipt);

    return tx;
  }

  async approveStable(_amount) {
    if (!this.staking || !this.stabletoken) {
      return;
    }

    const result = await this.stabletoken
      .connect(this.signer)
      .approve(this.staking.address, ethers.utils.parseUnits(_amount));

    return result;
  }

  async getStableBalance(formatted = false) {
    if (!this.stabletoken || !this.account) {
      return;
    }

    const result = await this.stabletoken.balanceOf(this.account);

    if (formatted) {
      return ethers.utils.formatUnits(result);
    } else {
      return result;
    }
  }

  async maxPossibleStake(tokenAddress, formatted = false) {
    if (!this.staking) {
      return;
    }

    const result = await this.staking.stakeAvailability(tokenAddress);

    if (formatted) {
      return ethers.utils.formatUnits(result);
    } else {
      return result;
    }
  }

  async getTokenAvailability(token, formatted = false) {
    if (!token) {
      return;
    }

    const result = await token.mintingAvailability();

    if (formatted) {
      return ethers.utils.formatUnits(result);
    } else {
      return result;
    }
  }
}

export { OnChain };
