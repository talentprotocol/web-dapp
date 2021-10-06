import React, { useState, useCallback, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { faSpinner, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { OnChain } from "src/onchain";

const StakeModal = ({ show, setShow, ticker, tokenAddress, talentAddress }) => {
  const [amount, setAmount] = useState("");
  const [availableAmount, setAvailableAmount] = useState("0");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [maxMinting, setMaxMinting] = useState("0");
  const [chainData, setChainData] = useState(null);
  const [targetToken, setTargetToken] = useState(null);
  const [stage, setStage] = useState(null);
  const [approving, setApproving] = useState(false);
  const [didAllowance, setDidAllowance] = useState(false);

  const setupOnChain = useCallback(async () => {
    const newOnChain = new OnChain();
    let result, _token;

    result = await newOnChain.initialize();

    if (!result) {
      return;
    }

    if (newOnChain.account) {
      setCurrentAccount(newOnChain.account);
    }

    if (tokenAddress) {
      _token = newOnChain.getToken(tokenAddress);
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
      const result = await chainData.connect();

      if (result) {
        setCurrentAccount(chainData.account);
      }
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
    if (!currentAccount || !targetToken) {
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

  const step = () => {
    if (chainData?.isConnected()) {
      if (didAllowance) {
        return "Stake";
      } else {
        return "Approve";
      }
    } else {
      return "Connect";
    }
  };

  return (
    <>
      <Modal
        scrollable={true}
        fullscreen={"md-down"}
        show={show}
        centered
        onHide={() => setShow(false)}
      >
        <Modal.Body className="show-grid p-4">
          <div className="container-fluid">
            <div className="row d-flex flex-column">
              <h2>GET {ticker}</h2>
              <p>
                We're currently only accepting cUSD to mint Talent Tokens. If
                you already have an active stake we'll use your current yield to
                increase you stake as well.
              </p>
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <input
                    className="text-right form-control"
                    inputMode="decimal"
                    type="text"
                    placeholder="0.0"
                    minLength="1"
                    maxLength="79"
                    onChange={(e) => setAmount(e.target.value)}
                    value={amount}
                  />
                  <small className="form-text text-primary">
                    You will receive {amount * 10} Talent Tokens.
                  </small>
                  <small className="form-text text-muted">
                    Available cUSD on your wallet:{" "}
                    {currentAccount
                      ? availableAmount
                      : "[Connect wallet to get available balance]"}
                  </small>
                  <small className="form-text text-muted">
                    There are {ticker} Talent Tokens available to be minted:{" "}
                    {maxMinting}
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
                    {step() == "Approve" && (
                      <button
                        className="btn btn-primary w-100"
                        disabled={amount == "" || approving}
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
                        Stake {icon()}
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
