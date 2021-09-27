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

  const setupOnChain = useCallback(async () => {
    const newOnChain = new OnChain();
    let result, _token;

    result = await newOnChain.initialize();

    if (!result) {
      return;
    }

    setChainData(newOnChain);

    if (newOnChain.account) {
      setCurrentAccount(newOnChain.account);
    }

    if (tokenAddress) {
      _token = newOnChain.getToken(tokenAddress);
      if (_token) {
        setTargetToken(_token);
      }
    } else {
      const _tokenAddress = await newOnChain.getTokenFromTalent(talentAddress);
      if (_tokenAddress != "0x0000000000000000000000000000000000000000") {
        _token = newOnChain.getToken(_tokenAddress);
        setTargetToken(_token);
      }
    }

    result = await newOnChain.loadStableToken();

    if (!result) {
      return;
    }

    const _availableAmount = await newOnChain.getStableBalance(true);
    setAvailableAmount(_availableAmount);

    newOnChain.loadStaking();

    const _tokenAvailability = await newOnChain.getTokenAvailability(
      _token,
      true
    );
    setMaxMinting(_tokenAvailability);
  }, []);

  const getWalletBalance = useCallback(async () => {
    if (chainData) {
      await chainData.loadAccount();
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

    const result = await chainData.createStake(
      targetToken._address,
      amount,
      (v) => {
        setStage("Verified");
        console.log(v);
      },
      (v) => {
        setStage("Error");
        console.log(v);
      },
      (v) => {
        setStage("Validation");
        console.log(v);
      }
    );
  };

  const approve = async (e) => {
    e.preventDefault();
    setApproving(true);
    await chainData.approveStable(amount);
    setApproving(false);
  };

  const connectWallet = async (e) => {
    e.preventDefault();

    if (chainData.web3.currentProvider) {
      const accounts = await chainData.web3.currentProvider.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
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

    return false;
  };

  return (
    <>
      <Modal
        scrollable={true}
        fullscreen={"md-down"}
        show={show}
        onHide={() => setShow(false)}
      >
        <Modal.Body className="show-grid">
          <div className="container-fluid">
            <div className="row d-flex flex-column">
              <h2>GET {ticker}</h2>
              <p>
                We're currently only accepting cUSD to trade for Talent Tokens.
              </p>
              <p>
                1 cUSD {"<->"} 1 Talent Token {"<->"} 50 TAL
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
                  {<small></small>}
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
                  <div className="d-flex flex-row justify-content-between mt-3">
                    <button
                      className="btn btn-secondary"
                      onClick={connectWallet}
                    >
                      Connect Wallet
                    </button>
                    <button
                      className="btn btn-primary"
                      disabled={approving}
                      onClick={approve}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={disabledStakeButton()}
                    >
                      Stake {icon()}
                    </button>
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
