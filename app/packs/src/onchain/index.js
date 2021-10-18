import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
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
    this.account = null;
    this.talentFactory = null;
    this.staking = null;
    this.stabletoken = null;
    this.celoKit = null;
    this.signer = null;

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

  // LOAD WEB3

  async connectedAccount() {
    try {
      await detectEthereumProvider();

      if (window.ethereum !== undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        window.ethereum.on("chainChanged", (_chainId) =>
          window.location.reload()
        );
        const signer = await provider.getSigner();
        this.signer = signer;
        const account = await signer.getAddress();
        this.account = account;

        return this.account;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  async getChainID() {
    let provider;
    await detectEthereumProvider();

    if (window.ethereum !== undefined) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      provider = new ethers.providers.JsonRpcProvider(this.fornoURI);
    }
    const network = await provider.getNetwork();

    return network.chainId;
  }

  async switchChain() {
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
  }

  async recognizedChain() {
    const chainId = await this.getChainID();
    const chainBN = ethers.BigNumber.from(chainId);

    if (chainBN.eq(ethers.BigNumber.from(ALFAJORES_PARAMS.chainId))) {
      return true;
    } else if (chainBN.eq(ethers.BigNumber.from(CELO_PARAMS.chainId))) {
      return true;
    } else {
      return false;
    }
  }

  async retrieveAccount() {
    try {
      await detectEthereumProvider();
      if (window.ethereum !== undefined) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        window.ethereum.on("chainChanged", (_chainId) =>
          window.location.reload()
        );
        const signer = await provider.getSigner();
        this.signer = signer;
        const account = await signer.getAddress();
        this.account = account;

        if (!(await this.recognizedChain())) {
          this.switchChain();
        }

        return this.account;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  // CONTRACT INTERACTION

  async loadFactory() {
    await detectEthereumProvider();

    let provider;
    if (window.ethereum !== undefined) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      provider = new ethers.providers.JsonRpcProvider(this.fornoURI);
    }

    this.talentFactory = new ethers.Contract(
      this.factoryAddress,
      TalentFactory.abi,
      provider
    );

    return true;
  }

  async loadStaking() {
    await detectEthereumProvider();

    let provider;
    if (window.ethereum !== undefined) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      provider = new ethers.providers.JsonRpcProvider(this.fornoURI);
    }

    if (await this.recognizedChain()) {
      this.staking = new ethers.Contract(
        this.stakingAddress,
        Staking.abi,
        provider
      );

      return true;
    } else {
      return false;
    }
  }

  async loadStableToken() {
    let provider;
    if (window.ethereum !== undefined) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      provider = new ethers.providers.JsonRpcProvider(this.fornoURI);
    }

    if (await this.recognizedChain()) {
      this.celoKit = newKit(this.fornoURI);

      const stableTokenAddress = await this.celoKit.registry.addressFor(
        CeloContract.StableToken
      );

      this.stabletoken = new ethers.Contract(
        stableTokenAddress,
        StableToken.abi,
        provider
      );

      return true;
    } else {
      return false;
    }
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

  async getToken(address) {
    let provider;
    if (window.ethereum !== undefined) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      provider = new ethers.providers.JsonRpcProvider(this.fornoURI);
    }
    if (await this.recognizedChain()) {
      return new ethers.Contract(address, TalentToken.abi, provider);
    } else {
      return false;
    }
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
