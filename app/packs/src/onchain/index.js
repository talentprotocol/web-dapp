import { ethers } from "ethers";
import { newKit, CeloContract } from "@celo/contractkit";
import dayjs from "dayjs";

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
      "0x6a630d53ABb7c17E51f7B67743e1502C3Ecc9360",
      TalentFactory.abi,
      this.provider
    );

    return true;
  }

  loadStaking() {
    this.staking = new ethers.Contract(
      "0x29270C602C0659260D555Ecd0b4F62eAb2c964Ef",
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

    const tx = await this.talentFactory
      .connect(this.signer)
      .createTalent(this.account, name, symbol);

    const receipt = await tx.wait();

    const event = receipt.events?.find((e) => {
      return e.event === "TalentCreated";
    });

    return event;
  }

  async calculateEstimatedReturns(token, _account) {
    if (!this.staking) {
      return;
    }

    const timestamp = dayjs().unix();

    const result = await this.staking.calculateEstimatedReturns(
      _account || this.account,
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

    const tx = await this.staking
      .connect(this.signer)
      .stakeStable(token, amount);

    const receipt = await tx.wait();

    return receipt;
  }

  async claimRewards(token) {
    if (!this.staking) {
      return;
    }

    const tx = await this.staking.connect(this.signer).claimRewards(token);

    const receipt = await tx.wait();

    return receipt;
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
