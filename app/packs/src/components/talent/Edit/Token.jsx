import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-bootstrap/Modal";

import { patch } from "src/utils/requests";
import { OnChain } from "src/onchain";
import { chainIdToName, chainNameToId } from "src/onchain/utils";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";
import Button from "src/components/design_system/button";
import TokenDetails from "src/components/talent/Show/TokenDetails";
import Caption from "src/components/design_system/typography/caption";
import ChainSelectionDropdown from "src/components/design_system/dropdowns/chain_selection_dropdown";
import {
  ArrowRight,
  ArrowLeft,
  Spinner,
  GreenCheck,
  Celo,
  Polygon,
} from "src/components/icons";

const LaunchTokenModal = ({
  mode,
  ticker,
  setTicker,
  setSelectedChain,
  error,
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState("Polygon");

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title className="px-3">Launch your Talent Token</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column w-100 p-3">
          <P2 mode={mode}>
            All Talent Tokens have a 1,000,000.00 maximum Supply. Until your
            token reaches the maximum supply it will have a fixed price of 5
            TAL.
          </P2>
          <TextInput
            title={"Ticker Name"}
            mode={mode}
            placeholder={"TAL"}
            shortCaption={"Upcase letters only. 3 to 8 characters"}
            onChange={(e) => setTicker(e.target.value)}
            value={ticker || ""}
            className="w-100 mt-3"
            maxLength={8}
            required={true}
            error={error?.length || error?.characters || error?.tickerTaken}
          />
          {error?.length && (
            <P2 className="text-danger">
              Your ticker needs to be between 3 and 8 characters.
            </P2>
          )}
          {error?.characters && (
            <P2 className="text-danger">
              Your ticker can only have uppercase characters.
            </P2>
          )}
          {error?.tickerTaken && (
            <P2 className="text-danger">Your ticker is already taken.</P2>
          )}
          <ChainSelectionDropdown
            className="mb-2"
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={setSelectedNetwork}
          />
          <div className={`divider ${mode} my-3`}></div>
          <P2 className="mb-2">
            Deploying a Talent Token requires you to confirm a transaction and
            pay a small transaction fee. After you launch your token we'll send
            you 2,000 of your own token!
          </P2>
          <Button
            onClick={() => setSelectedChain(selectedNetwork)}
            type="primary-default"
            className="w-100"
            mode={mode}
          >
            Create your Talent Token
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

const WalletNotConnected = ({ mode }) => (
  <>
    <Modal.Header closeButton>
      <Modal.Title className="px-3">Launch your Talent Token</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="d-flex flex-column w-100 p-3">
        <P2 mode={mode}>
          You need to connect your metamask before you are able to deploy your
          own Talent Token.
        </P2>
      </div>
    </Modal.Body>
  </>
);

const WrongNetwork = ({ chainId, mode, hide, switchNetwork, env }) => {
  const chainName = chainIdToName(chainId, env);
  return (
    <>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column justify-content-center align-items-center w-100 px-3 pb-3">
          {chainName == "Polygon" ? (
            <Polygon width="48" />
          ) : (
            <Celo width="48" />
          )}
          <H5 className="mt-4">Switch Network</H5>
          <P2 className="mb-3 text-center">
            To launch your talent token on the {chainName} network please change
            your current network.
          </P2>
          <div className="d-flex flex-row justify-content-between w-100 align-items-center">
            <Button
              onClick={hide}
              type="white-subtle"
              mode={mode}
              className="w-100 mt-3 mr-2"
            >
              Back
            </Button>
            <Button
              onClick={() => switchNetwork(chainId)}
              mode={mode}
              type="primary-default"
              className="w-100 mt-3"
            >
              Switch to {chainName}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </>
  );
};

const WaitingForConfirmation = ({ mode }) => (
  <>
    <Modal.Header closeButton>
      <Modal.Title className="px-3">Launch your Talent Token</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="d-flex flex-column justify-content-center align-items-center w-100 p-3">
        <P2 className="mb-3">
          Open your Metamask Wallet and confirm the transaction to deploy your
          Talent Token. After confirmation we need to wait for the transaction
          to be approved on the blockchain.
        </P2>
        <Spinner />
      </div>
    </Modal.Body>
  </>
);

const SuccessConfirmation = ({ mode, hide }) => {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title className="px-3">Launch your Talent Token</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column justify-content-center align-items-center w-100 p-3">
          <P2 className="w-100 text-center mb-3">
            You've successfully deployed your token!
          </P2>
          <GreenCheck mode={mode} />
          <Button
            onClick={hide}
            type="primary-default"
            mode={mode}
            className="w-100 mt-3"
          >
            Confirm
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

const Token = (props) => {
  const {
    mode,
    token,
    user,
    railsContext,
    mobile,
    changeTab,
    changeSharedState,
    requiredFields,
  } = props;
  const [ticker, setTicker] = useState(token.ticker || "");
  const [show, setShow] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validChain, setValidChain] = useState(true);
  const [walletConnected, setWalletConnected] = useState(true);
  const [error, setError] = useState({});
  const [factory, setFactory] = useState(null);
  const [contractId, setContractId] = useState(token.contract_id || "");
  const [selectedChain, setSelectedChain] = useState("");
  const [currentChain, setCurrentChain] = useState("");

  const changeTicker = (value) => {
    if (error["length"]) {
      setError((prev) => ({ ...prev, length: false }));
    }
    if (error["characters"]) {
      setError((prev) => ({ ...prev, characters: false }));
    }
    if (error["tickerTaken"]) {
      setError((prev) => ({ ...prev, tickerTaken: false }));
    }

    setTicker(value.toUpperCase());
  };

  const switchNetwork = async (networkId) => {
    const newOnChain = new OnChain(railsContext.contractsEnv);

    await newOnChain.switchChain(networkId);
  };

  const createToken = async () => {
    if (factory) {
      setDeploying(true);
      const result = await factory.createTalent(user.username, ticker);

      if (result.error) {
        setError((prev) => ({ ...prev, tickerTaken: true }));
        setDeploying(false);
        return;
      }

      if (result.canceled) {
        setDeploying(false);
        return;
      }

      if (result) {
        const contractAddress = result.args.token;

        const response = await patch(
          `/api/v1/talent/${props.talent.id}/tokens/${token.id}`,
          {
            token: {
              contract_id: contractAddress.toLowerCase(),
              deployed: true,
            },
          }
        );

        if (response) {
          setSuccess(true);
          setDeploying(false);
          setContractId(contractAddress.toLowerCase());
          changeSharedState((prev) => ({
            ...prev,
            token: {
              ...prev.token,
              contact_id: contractAddress.toLowerCase(),
              deployed: true,
            },
          }));
          return true;
        }
      }
      return false;
    }
  };

  const setupOnChain = useCallback(async () => {
    const newOnChain = new OnChain(railsContext.contractsEnv);
    let result;

    result = await newOnChain.connectedAccount();

    if (!result) {
      setWalletConnected(false);
      return;
    }

    const chainId = await newOnChain.getChainID();
    setCurrentChain(chainId);

    const validChain = await newOnChain.recognizedChain();
    setValidChain(validChain);

    result = newOnChain.loadFactory();

    if (result) {
      setFactory(newOnChain);
    } else {
      setDeploy("Unable to deploy token");
      return;
    }
  }, []);

  useEffect(() => {
    setupOnChain();
  }, []);

  const saveTicker = async () => {
    const response = await patch(
      `/api/v1/talent/${props.talent.id}/tokens/${token.id}`,
      {
        token: {
          ticker,
          chain_id: currentChain,
        },
      }
    ).catch(() => {
      console.log("error updating ticker");
      setShow(false);
    });

    if (response) {
      if (!response.error) {
        changeSharedState((prev) => ({
          ...prev,
          token: {
            ...prev.token,
            ticker,
          },
        }));
        return true;
      }
    }

    return false;
  };

  const handleDeploy = async () => {
    const tickerValidator = new RegExp("[^A-Z]+");
    if (tickerValidator.test(ticker)) {
      setError((prev) => ({ ...prev, characters: true }));
      return;
    }

    if (ticker.length < 3 || ticker.length > 8) {
      setError((prev) => ({ ...prev, length: true }));
      return;
    }

    const result = saveTicker();

    if (result) {
      const deployed = await createToken();

      if (!deployed) {
        setError((prev) => ({ ...prev, deploy: true }));
      }
    } else {
      setError((prev) => ({ ...prev, ticker: true }));
    }
  };

  const onClose = () => setShow(false);

  if (contractId && !show) {
    return (
      <>
        <H5 className="w-100 text-left" text={ticker} bold />
        <P2 className="w-100 text-left" mode={mode}>
          You can see all your token activity on your{" "}
          <a href="/portfolio" target="_blank">
            portfolio
          </a>
        </P2>
        <TokenDetails
          ticker={token.ticker}
          token={{ ...token, contract_id: contractId }}
          displayName={user.display_name || user.username}
          username={user.username}
          railsContext={railsContext}
          mobile={mobile}
          className="w-100 mb-4"
        />
        {mobile && (
          <div className="d-flex flex-row justify-content-between w-100 mt-4 mb-3">
            <div className="d-flex flex-column">
              <Caption text="PREVIOUS" />
              <div
                className="text-grey cursor-pointer"
                onClick={() => changeTab("Goal")}
              >
                <ArrowLeft color="currentColor" /> Goal
              </div>
            </div>
            <div className="d-flex flex-column">
              <Caption text="NEXT" />
              <div
                className="text-grey cursor-pointer"
                onClick={() => changeTab("Perks")}
              >
                Perks <ArrowRight color="currentColor" />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  const getCurrentModal = () => {
    if (deploying) {
      return WaitingForConfirmation;
    }

    if (success) {
      return SuccessConfirmation;
    }

    if (!walletConnected) {
      return WalletNotConnected;
    }

    if (
      !validChain ||
      (selectedChain !== "" && selectedChain !== currentChain)
    ) {
      return WrongNetwork;
    }

    return LaunchTokenModal;
  };

  const CurrentModal = getCurrentModal();

  const readyForLaunch = () =>
    requiredFields.length == 0 ||
    (requiredFields.length == 1 && requiredFields[0] == "Ticker");

  const deployOrChangeNetwork = (network) => {
    if (chainNameToId(network, railsContext.contractsEnv) == currentChain) {
      handleDeploy();
    } else {
      setSelectedChain(chainNameToId(network, railsContext.contractsEnv));
    }
  };

  return (
    <>
      <Modal
        scrollable={true}
        fullscreen={"md-down"}
        show={show}
        centered
        onHide={onClose}
        dialogClassName="remove-background"
      >
        <CurrentModal
          mode={mode}
          ticker={ticker}
          setTicker={changeTicker}
          deployToken={handleDeploy}
          hide={onClose}
          error={error}
          backdrop={false}
          setShow={setShow}
          chainId={selectedChain}
          setSelectedChain={deployOrChangeNetwork}
          switchNetwork={switchNetwork}
          env={railsContext.contractsEnv}
        />
      </Modal>
      <H5
        className="w-100 text-left"
        mode={mode}
        text="Launch your Talent Token today!"
        bold
      />
      <div className="d-flex flex-row w-100 justify-content-between mt-2">
        <div className="col-8 d-flex flex-column p-0">
          <P2 className="p2 w-100 text-left p-0" mode={mode}>
            We recommend using Metamask to deploy your token although other
            wallets are also supported. If you don't have a metamask wallet you
            can create it using{" "}
            <a href="https://www.metamask.io" target="_blank">
              Metamask.io
            </a>
          </P2>
          {!readyForLaunch() && (
            <P2>
              You must further complete your profile before you can launch your
              token.
            </P2>
          )}
        </div>
        <div>
          <Button
            onClick={() => setShow(true)}
            type="primary-default"
            mode={mode}
            disabled={!readyForLaunch()}
          >
            Launch Talent Token
          </Button>
        </div>
      </div>
      <div className={`divider ${mode} my-3`}></div>
      <TextInput
        title={"Ticker Name"}
        mode={mode}
        placeholder={"3 to 8 characters"}
        shortCaption={
          "Your ticker name will be visible next to your display name. You need to launch your talent token to enable buying your token."
        }
        onChange={(e) => changeTicker(e.target.value)}
        value={ticker || ""}
        className="w-100 mt-3"
        maxLength={8}
      />
      {mobile && (
        <div className="d-flex flex-row justify-content-between w-100 my-3">
          <div className="d-flex flex-column">
            <Caption text="PREVIOUS" />
            <div
              className="text-grey cursor-pointer"
              onClick={() => changeTab("Goal")}
            >
              <ArrowLeft color="currentColor" /> Goal
            </div>
          </div>
          <div className="d-flex flex-column">
            <Caption text="NEXT" />
            <div
              className="text-grey cursor-pointer"
              onClick={() => changeTab("Perks")}
            >
              Perks <ArrowRight color="currentColor" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Token;
