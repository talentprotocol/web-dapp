import React, { useState, useCallback, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { faSpinner, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { OnChain } from "src/onchain";
import { parseAndCommify } from "src/onchain/utils";

import { post, patch } from "src/utils/requests";

import { NoMetamask } from "../login/MetamaskConnect";

import P1 from "src/components/design_system/typography/p1";
import P2 from "src/components/design_system/typography/p2";

const StakeModal = ({
  show,
  setShow,
  ticker,
  tokenAddress,
  tokenId,
  railsContext,
  userId,
  mode,
}) => {
  const [amount, setAmount] = useState("");
  const [showNoMetamask, setShowNoMetamask] = useState(false);
  const [availableAmount, setAvailableAmount] = useState("0");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [maxMinting, setMaxMinting] = useState("0");
  const [chainData, setChainData] = useState(null);
  const [targetToken, setTargetToken] = useState(null);
  const [stage, setStage] = useState(null);
  const [approving, setApproving] = useState(false);
  const [didAllowance, setDidAllowance] = useState(false);
  const [validChain, setValidChain] = useState(true);
  const [valueError, setValueError] = useState(false);

  const setupOnChain = useCallback(async () => {
    const newOnChain = new OnChain(railsContext.contractsEnv);
    let result, _token;

    result = await newOnChain.connectedAccount();

    const validChain = await newOnChain.recognizedChain();
    setValidChain(validChain);

    if (!result) {
      setChainData(newOnChain);
      return;
    }

    if (newOnChain.account) {
      setCurrentAccount(newOnChain.account);
    }

    if (tokenAddress) {
      _token = await newOnChain.getToken(tokenAddress);
      if (_token) {
        setTargetToken(_token);
      }
    }

    result = await newOnChain.loadStableToken();

    if (!result) {
      setChainData(newOnChain);
      return;
    }

    const _availableAmount = await newOnChain.getStableBalance(true);
    setAvailableAmount(_availableAmount);

    newOnChain.loadStaking();

    if (_token) {
      const _tokenAvailability = await newOnChain.getTokenAvailability(
        _token,
        true
      );
      setMaxMinting(_tokenAvailability);
    }

    setChainData(newOnChain);
  }, []);

  const getWalletBalance = useCallback(async () => {
    if (chainData) {
      await chainData.loadStableToken();
      const _availableAmount = await chainData.getStableBalance(true);

      setAvailableAmount(_availableAmount);
    }
  }, [currentAccount]);

  useEffect(() => {
    setupOnChain();
  }, []);

  useEffect(() => {
    getWalletBalance();
  }, [currentAccount]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!currentAccount) {
      console.log("NO CURRENT ACCOUNT");
      return;
    }

    if (parseFloat(amount) > parseFloat(availableAmount)) {
      console.log("AMOUNT IS TOO HIGH");
      return;
    }

    setStage("Confirm");

    const result = await chainData
      .createStake(targetToken.address, amount)
      .catch(() => setStage("Error"));

    if (result) {
      const _availableAmount = await chainData.getStableBalance(true);
      setAvailableAmount(_availableAmount);

      const _tokenAvailability = await chainData.getTokenAvailability(
        targetToken,
        true
      );
      setMaxMinting(_tokenAvailability);

      await post(`/api/v1/stakes`, {
        stake: { token_id: tokenId },
      }).catch((e) => console.log(e));

      setStage("Verified");
    } else {
      setStage("Error");
    }
  };

  const approve = async (e) => {
    e.preventDefault();
    setApproving(true);
    const allowedValue = await chainData.getStableAllowance(true);

    if (parseFloat(amount) > parseFloat(allowedValue)) {
      await chainData.approveStable(amount);
    }

    setDidAllowance(true);
    setApproving(false);
  };

  const connectWallet = async (e) => {
    e.preventDefault();

    if (chainData) {
      const result = await chainData.retrieveAccount();

      if (result) {
        await patch(`/api/v1/users/${userId}`, {
          wallet_id: chainData.account.toLowerCase(),
        }).catch(() => null);
        setCurrentAccount(chainData.account);
      }
    } else {
      setShow(false);
      setShowNoMetamask(true);
    }
  };

  const icon = () => {
    if (!stage) {
      return "";
    }
    if (stage == "Validation" || stage == "Confirm") {
      return <FontAwesomeIcon icon={faSpinner} spin />;
    }
    if (stage == "Error") {
      return <FontAwesomeIcon icon={faTimes} />;
    }
    if (stage == "Verified") {
      return <FontAwesomeIcon icon={faCheck} />;
    }
  };

  const disabledStakeButton = () => {
    if (!currentAccount || !targetToken || valueError) {
      return true;
    }

    if (amount == "") {
      return true;
    }

    if (stage !== null) {
      return true;
    }

    return false;
  };

  const changeNetwork = async () => {
    await chainData.switchChain();
    window.location.reload();
  };

  const step = () => {
    if (chainData?.account) {
      if (!validChain) {
        return "Change network";
      }
      if (didAllowance) {
        return "Stake";
      } else {
        return "Approve";
      }
    } else {
      return "Connect";
    }
  };

  const setValidAmount = (value) => {
    if (
      parseFloat(value) < 0 ||
      parseFloat(value) > parseFloat(availableAmount)
    ) {
      setValueError(true);
    } else {
      setValueError(false);
    }

    setAmount(value);
  };

  return (
    <>
      <NoMetamask show={showNoMetamask} hide={() => setShowNoMetamask(false)} />
      <Modal
        scrollable={true}
        fullscreen={"md-down"}
        show={show}
        centered
        onHide={() => setShow(false)}
        dialogClassName="remove-background"
      >
        <Modal.Body className="show-grid p-4">
          <div className="container-fluid">
            <div className="row d-flex flex-column">
              <P1 text={`BUY ${ticker}`} bold />
              <P2>
                Please insert the amount of cUSD (Celo's stablecoin) you wish to
                use to buy Talent Tokens. You'll need to have cUSD in your
                Metamask wallet to do this transaction. Check the{" "}
                <a
                  target="self"
                  href="https://talentprotocol.notion.site/User-Onboarding-Guide-1b9a378cb8224ba89ea5aff69cbf5735"
                >
                  guide
                </a>{" "}
                if you need help to top up your account.
                <small className="form-text text-muted">
                  You'll be able to sell your Talent Tokens once we launch the
                  $TAL token next year (subject to flow controls).
                </small>
              </P2>
              <form onSubmit={onSubmit}>
                <div className="form-group position-relative">
                  <small className="form-text text-muted">
                    Available cUSD on your wallet:{" "}
                    {currentAccount
                      ? parseAndCommify(availableAmount)
                      : "[Connect wallet to get available balance]"}
                  </small>
                  <input
                    className={`text-right form-control ${
                      valueError ? "border-danger" : ""
                    }`}
                    inputMode="decimal"
                    type="number"
                    placeholder="0.0"
                    onChange={(e) => setValidAmount(e.target.value)}
                    value={amount}
                  />
                  <small
                    className="text-muted position-absolute"
                    style={{ left: 10, top: 30 }}
                  >
                    cUSD
                  </small>
                  <small className="form-text text-primary">
                    You will receive {amount * 10} {ticker}.
                  </small>
                  <small className="form-text text-muted">
                    {ticker} tokens still available: {maxMinting}
                  </small>
                  <div className="d-flex flex-row mt-3">
                    {step() == "Connect" && (
                      <button
                        className="btn btn-primary w-100"
                        onClick={connectWallet}
                      >
                        Connect Wallet
                      </button>
                    )}
                    {step() == "Change network" && (
                      <button
                        className="btn btn-primary w-100"
                        onClick={changeNetwork}
                      >
                        Change Network
                      </button>
                    )}
                    {step() == "Approve" && (
                      <button
                        className="btn btn-primary w-100"
                        disabled={
                          amount == "" ||
                          approving ||
                          parseFloat(amount) > parseFloat(maxMinting) ||
                          valueError
                        }
                        onClick={approve}
                      >
                        Approve
                      </button>
                    )}
                    {step() == "Stake" && (
                      <button
                        className="btn btn-primary w-100"
                        type="submit"
                        disabled={disabledStakeButton()}
                      >
                        Buy {icon()}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default StakeModal;
