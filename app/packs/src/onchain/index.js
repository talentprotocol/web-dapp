import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { newKit, CeloContract } from "@celo/contractkit";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import dayjs from "dayjs";

import TalentToken from "../abis/recent/TalentToken.json";
import Staking from "../abis/recent/Staking.json";
import TalentFactory from "../abis/recent/TalentFactory.json";
import StableToken from "../abis/recent/StableToken.json";
import CommunityUser from "../abis/recent/CommunityUser.json";

import Addresses from "./addresses.json";
import { ERROR_MESSAGES } from "../utils/constants";
import { ipfsToURL } from "./utils";
import { externalGet } from "src/utils/requests";

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
    this.env = env || "development";

    if (this.env) {
      this.factoryAddress = Addresses[this.env]["factory"];
      this.stakingAddress = Addresses[this.env]["staking"];
      this.fornoURI = Addresses[this.env]["forno"];
    } else {
      this.factoryAddress = Addresses["production"]["factory"];
      this.stakingAddress = Addresses["production"]["staking"];
      this.fornoURI = Addresses["production"]["forno"];
    }
    this.web3Modal = this.initializeWeb3Modal();
  }

  initializeWeb3Modal = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          rpc: {
            [parseInt(this.getEnvChainID())]: this.getEnvRpcURls()[0],
          },
        },
      },
    };

    return new Web3Modal({
      cacheProvider: true,
      providerOptions,
    });
  };

  // LOAD WEB3

  async web3ModalConnect() {
    try {
      const web3ModalInstance = await this.web3Modal.connect();

      return web3ModalInstance;
    } catch {
      return undefined;
    }
  }

  async connectedAccount() {
    try {
      let web3ModalInstance;

      if (this.web3Modal.cachedProvider) {
        web3ModalInstance = await this.web3ModalConnect();
      } else {
        return false;
      }

      if (web3ModalInstance !== undefined) {
        const provider = new ethers.providers.Web3Provider(web3ModalInstance);
        web3ModalInstance.on("chainChanged", (_chainId) =>
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
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getChainID() {
    let provider;
    const web3ModalInstance = await this.web3ModalConnect();

    if (web3ModalInstance !== undefined) {
      provider = new ethers.providers.Web3Provider(web3ModalInstance);
    } else {
      provider = new ethers.providers.JsonRpcProvider(this.fornoURI);
    }
    const network = await provider.getNetwork();

    return network.chainId;
  }

  getEnvChainID = () => {
    if (this.env == "production") {
      return CELO_PARAMS.chainId;
    } else {
      return ALFAJORES_PARAMS.chainId;
    }
  };

  getEnvRpcURls = () => {
    if (this.env == "production") {
      return CELO_PARAMS.rpcUrls;
    } else {
      return ALFAJORES_PARAMS.rpcUrls;
    }
  };

  getEnvBlockExplorerUrls = () => {
    if (this.env == "production") {
      return CELO_PARAMS.blockExplorerUrls;
    } else {
      return ALFAJORES_PARAMS.blockExplorerUrls;
    }
  };

  getEnvNetworkParams = () => {
    if (this.env == "production") {
      return CELO_PARAMS;
    } else {
      return ALFAJORES_PARAMS;
    }
  };

  async switchChain() {
    try {
      const web3ModalInstance = await this.web3ModalConnect();

      await web3ModalInstance.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: this.getEnvChainID() }],
      });
    } catch (error) {
      console.log(error);
      // metamask mobile throws an error but that error has no code
      // https://github.com/MetaMask/metamask-mobile/issues/3312
      if (!!error.code || error.code === 4902) {
        await web3ModalInstance.request({
          method: "wallet_addEthereumChain",
          params: [this.getEnvNetworkParams()],
        });
        await web3ModalInstance.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: this.getEnvChainID() }],
        });
      }
    }
  }

  async recognizedChain() {
    const chainId = await this.getChainID();
    const chainBN = ethers.BigNumber.from(chainId);

    if (chainBN.eq(ethers.BigNumber.from(this.getEnvChainID()))) {
      return true;
    } else {
      return false;
    }
  }

  async retrieveAccount() {
    try {
      const web3ModalInstance = await this.web3ModalConnect();

      if (web3ModalInstance !== undefined) {
        const provider = new ethers.providers.Web3Provider(web3ModalInstance);
        await web3ModalInstance.enable();

        web3ModalInstance.on("chainChanged", (_chainId) =>
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
    } catch (error) {
      console.error(error);
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
    try {
      const web3ModalInstance = await this.web3ModalConnect();
      let provider;

      if (web3ModalInstance !== undefined) {
        provider = new ethers.providers.Web3Provider(web3ModalInstance);
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
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async loadStableToken() {
    try {
      const web3ModalInstance = await this.web3ModalConnect();
      let provider;

      if (web3ModalInstance !== undefined) {
        provider = new ethers.providers.Web3Provider(web3ModalInstance);
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
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async createTalent(name, symbol) {
    if (!this.talentFactory) {
      return;
    }

    const tx = await this.talentFactory
      .connect(this.signer)
      .createTalent(this.account, name, symbol)
      .catch((e) => {
        if (e.data?.message.includes(ERROR_MESSAGES.ticker_reserved)) {
          return { error: "Ticker is already in use" };
        } else if (e.code === 4001) {
          return { canceled: "User canceled the request" };
        } else if (e.data.message) {
          return { error: e.data.message };
        }
        return { error: e };
      });

    if (tx.error || tx.canceled) {
      return tx;
    }

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
    const web3ModalInstance = await this.web3ModalConnect();
    let provider;

    if (web3ModalInstance !== undefined) {
      provider = new ethers.providers.Web3Provider(web3ModalInstance);
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

    // estimate the gas price before submitting the TX
    // so that we can manually override the gas limit
    // - this doesn't increase the cost, since the cost will
    //   be whatever it is, it simply allows a higher value
    const estimatedGasPrice = await this.staking
      .connect(this.signer)
      .estimateGas.stakeStable(token, amount);

    const tx = await this.staking
      .connect(this.signer)
      .stakeStable(token, amount, {
        gasLimit: estimatedGasPrice.mul(130).div(100), // increase amount by 30%
      });

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

  // ONCHAIN UTILS

  async addTokenToWallet(contract_id, symbol) {
    const web3ModalInstance = await this.web3ModalConnect();

    if (!web3ModalInstance) {
      return;
    }
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await web3ModalInstance.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: contract_id, // The address that the token is at.
            symbol: symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: 18, // The number of decimals in the token
          },
        },
      });

      if (wasAdded) {
        console.log("Added token to metamask");
      } else {
        console.log("Token not added to metamask");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getNFTImg(contract_id, token_id) {
    const web3ModalInstance = await this.web3ModalConnect();
    let provider;

    if (web3ModalInstance !== undefined) {
      provider = new ethers.providers.Web3Provider(web3ModalInstance);
    } else {
      provider = new ethers.providers.JsonRpcProvider(this.fornoURI);
    }

    const nft = new ethers.Contract(contract_id, CommunityUser.abi, provider);
    const uri = await nft.tokenURI(token_id);

    const url = ipfsToURL(uri);
    const result = await externalGet(url);

    const imageUrl = ipfsToURL(result.image);

    return imageUrl;
  }
}

export { OnChain };
