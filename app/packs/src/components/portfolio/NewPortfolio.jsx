import React, {
  useState,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";

import { ethers } from "ethers";
import currency from "currency.js";
import Modal from "react-bootstrap/Modal";
import transakSDK from "@transak/transak-sdk";

import {
  ApolloProvider,
  useQuery,
  GET_SUPPORTER_PORTFOLIO,
  client,
} from "src/utils/thegraph";
import { OnChain } from "src/onchain";
import { useWindowDimensionsHook } from "src/utils/window";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

import RewardsModal from "./components/RewardsModal";
import Supporting from "./components/Supporting";
import Supporters from "./components/Supporters";
import MobilePortfolio from "./components/MobilePortfolio";

import P3 from "src/components/design_system/typography/p3";
import P2 from "src/components/design_system/typography/p2";
import H4 from "src/components/design_system/typography/h4";
import H5 from "src/components/design_system/typography/h5";
import Button from "src/components/design_system/button";
import { Spinner } from "src/components/icons";

const TransakDone = ({ show, hide }) => (
  <Modal show={show} onHide={hide} centered>
    <Modal.Header closeButton>
      <Modal.Title>Thank you for your support</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>
        You have successfully acquired cUSD on the CELO network. It usually
        takes a couple minutes to finish processing and for you to receive your
        funds, you'll get a confirmation email from transak once you do. After
        that you're ready to start supporting talent!
      </p>
    </Modal.Body>
  </Modal>
);

const LoadingPortfolio = ({ mode }) => {
  return (
    <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
      <Spinner />
    </div>
  );
};

const ChangeNetwork = ({ mode, networkChange }) => {
  return (
    <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
      <H5 mode={mode} text="Please change your network" bold />
      <P2
        mode={mode}
        text="To see your portfolio you need to change network to CELO."
        bold
      />
      <Button
        onClick={networkChange}
        type="primary-default"
        mode={mode}
        className="mt-3"
      >
        Change Network
      </Button>
    </div>
  );
};

const Error = ({ mode }) => {
  return (
    <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
      <H5 mode={mode} text="We're having trouble loading your portfolio" bold />
      <P2
        mode={mode}
        text="We're sorry for the inconvenience and we're working hard to get things back up"
        bold
      />
    </div>
  );
};

const newTransak = (width, height, env, apiKey) => {
  const envName = env ? env.toUpperCase() : "STAGING";

  return new transakSDK({
    apiKey: apiKey, // Your API Key
    environment: envName, // STAGING/PRODUCTION
    defaultCryptoCurrency: "CUSD",
    fiatCurrency: "EUR",
    defaultPaymentMethod: "credit_debit_card",
    themeColor: "000000",
    hostURL: window.location.origin,
    widgetHeight: `${height}px`,
    widgetWidth: `${width}px`,
    network: "CELO",
    cryptoCurrencyList: "CUSD",
  });
};

const NewPortfolio = ({ address, tokenAddress, railsContext }) => {
  // --- On chain variables ---
  const [localAccount, setLocalAccount] = useState(address || "");
  const { loading, error, data, refetch } = useQuery(GET_SUPPORTER_PORTFOLIO, {
    variables: { id: localAccount.toLowerCase() },
  });

  const [chainAPI, setChainAPI] = useState(null);
  const [stableBalance, setStableBalance] = useState(0);
  const [returnValues, setReturnValues] = useState({});
  const [activeContract, setActiveContract] = useState(null);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [wrongChain, setWrongChain] = useState(false);

  // --- Interface variables ---
  const { height, width } = useWindowDimensionsHook();
  const mobile = width < 992;
  const theme = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState(
    mobile ? "Overview" : "Supporting"
  );
  const [show, setShow] = useState(false);

  // --- TRANSAK ---
  const [transakDone, setTransakDone] = useState(false);

  const onClickTransak = (e) => {
    e.preventDefault();

    const _width = width > 450 ? 450 : width;
    const _height = height > 700 ? 700 : height;

    const transak = newTransak(
      _width,
      _height,
      railsContext.contractsEnv,
      railsContext.transakApiKey
    );
    transak.init();

    // To get all the events
    transak.on(transak.ALL_EVENTS, (data) => {
      console.log(data);
    });

    // This will trigger when the user marks payment is made.
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      transak.close();
      setTransakDone(true);
    });
  };

  // --- On chain functions ---

  const supportedTalents = useMemo(() => {
    if (!data || data.supporter == null) {
      return [];
    }

    return data.supporter.talents.map(({ amount, talAmount, talent }) => ({
      id: talent.owner,
      symbol: talent.symbol,
      name: talent.name,
      amount: ethers.utils.formatUnits(amount),
      talAmount: ethers.utils.formatUnits(talAmount),
      totalSupply: ethers.utils.formatUnits(talent.totalSupply),
      nrOfSupporters: talent.supporterCounter,
      contract_id: talent.id,
    }));
  }, [data]);

  const rewardsClaimed = () => {
    if (!data || data.supporter == null) {
      return 0;
    }

    return ethers.utils.formatUnits(data.supporter.rewardsClaimed);
  };

  const setupChain = useCallback(async () => {
    const newOnChain = new OnChain(railsContext.contractsEnv);

    await newOnChain.connectedAccount();
    await newOnChain.loadStaking();
    await newOnChain.loadStableToken();
    const balance = await newOnChain.getStableBalance(true);

    if (balance) {
      setStableBalance(balance);
    }

    if (localAccount != "" && newOnChain.account) {
      setLocalAccount(newOnChain.account);
      refetch();
    }

    if (newOnChain) {
      const chainAvailable = await newOnChain.recognizedChain();
      setWrongChain(!chainAvailable);
      setChainAPI(newOnChain);
    }
  });

  const updateAll = async () => {
    supportedTalents.forEach((element) => {
      loadReturns(element.contract_id).then((returns) => {
        setReturnValues((prev) => ({
          ...prev,
          [element.contract_id]: returns,
        }));
      });
    });
  };

  const talentTokensSum = useMemo(() => {
    let sum = ethers.BigNumber.from(0);

    supportedTalents.map((talent) => {
      sum = sum.add(ethers.utils.parseUnits(talent.amount));
    });
    return ethers.utils.formatUnits(sum);
  }, [supportedTalents]);

  useEffect(() => {
    updateAll();
  }, [supportedTalents, chainAPI]);

  useEffect(() => {
    setupChain();
  }, []);

  const loadReturns = async (contractAddress) => {
    if (chainAPI && contractAddress) {
      const value = await chainAPI.calculateEstimatedReturns(
        contractAddress,
        null
      );

      if (value?.stakerRewards) {
        return ethers.utils.formatUnits(value.stakerRewards);
      } else {
        return "0";
      }
    }

    return "0";
  };

  const claimRewards = async () => {
    if (chainAPI && activeContract) {
      if (!(await chainAPI.recognizedChain())) {
        await chainAPI.switchChain();
      } else {
        setLoadingRewards(true);
        await chainAPI.claimRewards(activeContract).catch(() => null);
        refetch();
      }
    }
    setLoadingRewards(false);
    setShow(false);
    setActiveContract(null);
  };

  const onClaim = (contract_id) => {
    setActiveContract(contract_id);
    setShow(true);
  };

  const networkChange = async () => {
    if (chainAPI) {
      await chainAPI.switchChain();
    }
  };

  // --- Overview calculations ---
  const cUSDBalance = parseFloat(stableBalance);
  const talentTokensTotal = parseFloat(talentTokensSum);
  const cUSDBalanceInTAL = cUSDBalance * 50;
  const totalRewardsInCUSD = parseFloat(rewardsClaimed()) * 0.02;
  const talentTokensInTAL = talentTokensTotal * 5;
  const talentTokensInCUSD = talentTokensTotal * 0.1;

  const overallCUSD = cUSDBalance + talentTokensInCUSD;
  const overallTAL = cUSDBalanceInTAL + talentTokensInTAL;

  if (loading || chainAPI === null) {
    return <LoadingPortfolio />;
  }

  if (error !== undefined) {
    return <Error mode={theme.mode()} />;
  }

  if (wrongChain) {
    return <ChangeNetwork mode={theme.mode()} networkChange={networkChange} />;
  }

  if (mobile) {
    return (
      <MobilePortfolio
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={theme.mode()}
        overallCUSD={overallCUSD}
        overallTAL={overallTAL}
        totalRewardsInCUSD={totalRewardsInCUSD}
        rewardsClaimed={rewardsClaimed}
        cUSDBalance={cUSDBalance}
        cUSDBalanceInTAL={cUSDBalanceInTAL}
        supportedTalents={supportedTalents}
        talentTokensInTAL={talentTokensInTAL}
        talentTokensInCUSD={talentTokensInCUSD}
        returnValues={returnValues}
        onClaim={onClaim}
        tokenAddress={tokenAddress}
        chainAPI={chainAPI}
      />
    );
  }

  return (
    <div className={`d-flex flex-column ${mobile ? "" : "px-3"}`}>
      <RewardsModal
        show={show}
        setShow={setShow}
        claim={claimRewards}
        loadingRewards={loadingRewards}
        activeContract={activeContract}
        rewardValues={returnValues}
        rewards={returnValues[activeContract] || "0"}
        supportedTalents={supportedTalents}
        mode={theme.mode()}
      />
      <TransakDone show={transakDone} hide={() => setTransakDone(false)} />
      <div className="d-flex flex-row justify-content-between flex-wrap w-100 portfolio-amounts-overview mt-4 p-4">
        <div className="d-flex flex-column mt-3">
          <P3 mode={theme.mode()} text={"Total Balance"} />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4
              mode={theme.mode()}
              text={currency(overallCUSD).format()}
              bold
              className="mb-0 mr-2"
            />
            <P2
              mode={theme.mode()}
              text={`${currency(overallTAL).format().substring(1)} $TAL`}
              bold
            />
          </div>
        </div>
        <div className="d-flex flex-column mt-3">
          <P3 mode={theme.mode()} text={"Total Rewards Claimed"} />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4
              mode={theme.mode()}
              text={currency(totalRewardsInCUSD).format()}
              bold
              className="mb-0 mr-2"
            />
            <P2
              mode={theme.mode()}
              text={`${currency(parseFloat(rewardsClaimed()))
                .format()
                .substring(1)} $TAL`}
              bold
            />
          </div>
        </div>
        <div className="d-flex flex-column mt-3">
          <P3 mode={theme.mode()} text={"Wallet Balance"} />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4
              mode={theme.mode()}
              text={currency(cUSDBalance).format()}
              bold
              className="mb-0 mr-2"
            />
            <P2
              mode={theme.mode()}
              text={`${currency(cUSDBalanceInTAL).format().substring(1)} $TAL`}
              bold
            />
          </div>
        </div>
        <div className="d-flex flex-row align-items-end">
          <div className="d-flex flex-row">
            <Button
              onClick={onClickTransak}
              type="primary-default"
              mode={theme.mode()}
              className="mr-2 mt-2"
            >
              Get Funds
            </Button>
            <Button
              onClick={() => console.log("Withdraw")}
              disabled={true}
              type="white-subtle"
              mode={theme.mode()}
              className="mr-2 mt-2"
            >
              Withdraw
            </Button>
          </div>
        </div>
      </div>
      <div className="w-100 talent-table-tabs mt-3 d-flex flex-row align-items-center">
        <div
          onClick={() => setActiveTab("Supporting")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "Supporting" ? " active-talent-table-tab" : ""
          }`}
        >
          Supporting
        </div>
        {tokenAddress && (
          <div
            onClick={() => setActiveTab("Supporters")}
            className={`py-2 px-2 talent-table-tab${
              activeTab == "Supporters" ? " active-talent-table-tab" : ""
            }`}
          >
            Supporters
          </div>
        )}
      </div>
      {activeTab == "Supporting" && (
        <Supporting
          mode={theme.mode()}
          talents={supportedTalents}
          returnValues={returnValues}
          onClaim={onClaim}
        />
      )}
      {activeTab == "Supporters" && (
        <Supporters
          mode={theme.mode()}
          tokenAddress={tokenAddress}
          onClaim={onClaim}
          chainAPI={chainAPI}
        />
      )}
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer>
      <ApolloProvider client={client(railsContext.contractsEnv)}>
        <NewPortfolio {...props} railsContext={railsContext} />
      </ApolloProvider>
    </ThemeContainer>
  );
};
