import { ethers } from "ethers";
import { newKit, CeloContract } from "@celo/contractkit";
import dayjs from "dayjs";

import TalentToken from "../abis/recent/TalentToken.json";
import Staking from "../abis/recent/Staking.json";
import TalentFactory from "../abis/recent/TalentFactory.json";
import StableToken from "../abis/recent/StableToken.json";

import Addresses from "./addresses.json";

const ALFAJORES_PARAMS = {
  chainId: "0xaef3",
  chainName: "Alfajores Testnet",
  nativeCurrency: { name: "Alfajores Celo", symbol: "A-CELO", decimals: 18 },
  rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
  blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.org/"],
  iconUrls: ["future"],
};

const CELO_PARAMS = {
  chainId: "0xa4ec",
  chainName: "Celo",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
  rpcUrls: ["https://forno.celo.org"],
  blockExplorerUrls: ["https://explorer.celo.org/"],
  iconUrls: ["future"],
};

class OnChain {
  constructor(env) {
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
    this.network = null;

    if (env) {
      this.factoryAddress = Addresses[env]["factory"];
      this.stakingAddress = Addresses[env]["staking"];
      this.fornoURI = Addresses[env]["forno"];
    } else {
      this.factoryAddress = Addresses["production"]["factory"];
      this.stakingAddress = Addresses["production"]["staking"];
      this.fornoURI = Addresses["production"]["forno"];
    }
  }

  async initialize() {
    const result = await this.loadWeb3();
    if (!result) return false;

    ethereum.on("chainChanged", (_chainId) => window.location.reload());

    await this.loadAccount();

    return true;
  }

  loadFactory() {
    this.talentFactory = new ethers.Contract(
      this.factoryAddress,
      TalentFactory.abi,
      this.provider
    );

    return true;
  }

  loadStaking() {
    this.staking = new ethers.Contract(
      this.stakingAddress,
      Staking.abi,
      this.provider
    );

    return true;
  }

  async loadStableToken() {
    this.celoKit = newKit(this.fornoURI);

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

  isConnected() {
    return !!this.account;
  }

  async loadAccount() {
    this.network = await this.provider.getNetwork();

    if (
      !ethers.BigNumber.from(this.network.chainId).eq(
        ethers.BigNumber.from(ALFAJORES_PARAMS.chainId)
      )
    ) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ALFAJORES_PARAMS.chainId }],
        });
      } catch (error) {
        if (error.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [ALFAJORES_PARAMS],
          });
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ALFAJORES_PARAMS.chainId }],
          });
        }
      }
      return;
    }

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
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    } else if (window.web3) {
      this.provider = new ethers.providers.Web3Provider(
        window.web3.currentProvider
      );
    } else {
      // On mobile ethereum might not be ready yet
      window.addEventListener("ethereum#initialized", loadWeb3, {
        once: true,
      });
      setTimeout(loadWeb3, 3000);

      // Add fallback to infura or forno
      this.provider = new ethers.providers.JsonRpcProvider(this.fornoURI);

      await this.provider.ready;

      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
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
    if (!this.staking || !(_account || this.account)) {
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

  async getStableAllowance(formatted = false) {
    if (!this.stabletoken || !this.account) {
      return "0";
    }

    const result = await this.stabletoken.allowance(
      this.account,
      this.staking.address
    );

    if (formatted) {
      return ethers.utils.formatUnits(result);
    } else {
      return result;
    }
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
