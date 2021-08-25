import React, { useState, useContext, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Web3Container, { Web3Context } from "src/contexts/web3Context";
import { post } from "src/utils/requests";

import AsyncValue from "../loader/AsyncValue";
import TradeModal from "./TradeModal";

const TokenSelection = ({
  uniqueId,
  selectedToken,
  tokens,
  setToken,
  loading,
}) => {
  const tokenArray = Object.keys(tokens).map((address) => tokens[address]);

  return (
    <Dropdown>
      <Dropdown.Toggle
        className="tal-nav-dropdown-btn text-primary"
        variant="primary"
        id="dropdown-basic"
      >
        <strong>
          {selectedToken.symbol ? `$${selectedToken.symbol}` : "Select"}
        </strong>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {loading && (
          <>
            <Dropdown.Item>
              <AsyncValue size={10} />
            </Dropdown.Item>
            <Dropdown.Item>
              <AsyncValue size={10} />
            </Dropdown.Item>
            <Dropdown.Item>
              <AsyncValue size={10} />
            </Dropdown.Item>
            <Dropdown.Item>
              <AsyncValue size={10} />
            </Dropdown.Item>
          </>
        )}
        {!loading &&
          tokenArray.map((otherToken) => (
            <Dropdown.Item
              key={`${uniqueId}-${otherToken.symbol}`}
              onClick={() => setToken(otherToken)}
            >
              ${otherToken.symbol}
            </Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const Swap = () => {
  const web3 = useContext(Web3Context);
  const [mode, setMode] = useState("buy");
  const [selectedToken, setSelectedToken] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [trading, setTrading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [requested, setRequested] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);

  const inputToken = () =>
    mode == "buy"
      ? web3.talToken
      : web3.tokens[selectedToken] || { balance: 0.0 };
  const outputToken = () =>
    mode == "buy"
      ? web3.tokens[selectedToken] || { balance: 0.0 }
      : web3.talToken;

  // given tokenA amount, how much tokenB do you get -- replace with calculating value from web3 with a debounce
  const calculateComplementValue = (amount) => {
    if (mode == "buy") {
      return web3.simulateBuy(selectedToken, amount * 100.0);
    } else {
      return web3.simulateSell(selectedToken, amount * 100.0);
    }
  };

  useEffect(() => {
    if (selectedToken == "") {
      // get token from URL, tokens are available
      const url = new URL(document.location);
      const ticker = url.searchParams.get("ticker");

      const tokenIndex = Object.keys(web3.tokens).findIndex(
        (address) => web3.tokens[address].symbol == ticker
      );
      if (tokenIndex >= 0) {
        setSelectedToken(Object.keys(web3.tokens)[tokenIndex]);
      }
    } else {
      // sync URL with selected token
      const url = new URL(window.location);
      url.searchParams.set("ticker", web3.tokens[selectedToken].symbol);
      window.history.pushState({}, "", url);
    }
  }, [selectedToken, web3.tokens]);

  const onTextChange = ({
    value,
    token,
    tokenChange,
    max,
    otherToken,
    otherTokenChange,
  }) => {
    if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
      if (parseFloat(value) > max) {
        tokenChange(max);
        if (otherToken.symbol) {
          calculateComplementValue(max).then((result) => {
            otherTokenChange(result / 100.0);
          });
        }
      } else {
        tokenChange(value);
        if (otherToken.symbol) {
          calculateComplementValue(value).then((result) => {
            otherTokenChange(result / 100.0);
          });
        }
      }
    }
  };

  const trackToken = () => {
    web3.provider.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: web3.tokens[selectedToken].address, // The address that the token is at.
          symbol: web3.tokens[selectedToken].symbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: 2, // The number of decimals in the token
          image: document.location.origin + "/tal.png", // A string url of the token logo
        },
      },
    });
  };

  const buttonDisabled = () =>
    !(parseFloat(inputAmount) > 0.0 && parseFloat(outputAmount) > 0.0) ||
    trading;

  const onSubmit = async (e) => {
    e.preventDefault();

    setTrading(true);
  };

  const onInputTokenSet = (selectedToken) => {
    // switch tokens
    if (selectedToken.symbol == outputToken().symbol) {
      mode == "buy" ? setMode("sell") : setMode("buy");
    } else {
      setSelectedToken(selectedToken.address);
    }
    setInputAmount("");
    setOutputAmount("");
  };

  const onOutputTokenSet = (selectedToken) => {
    // switch tokens
    if (selectedToken.symbol == inputToken().symbol) {
      mode == "buy" ? setMode("sell") : setMode("buy");
    } else {
      setSelectedToken(selectedToken.address);
    }
    setOutputAmount("");
    setInputAmount("");
  };

  const onFinish = () => {
    setInputAmount("");
    setOutputAmount("");
    setTrading(false);
    setApproved(false);
    setRequested(false);
    setConfirmed(false);
    setDone(false);
  };

  const changeMode = () => {
    setMode(mode == "buy" ? "sell" : "buy");
  };

  const transact = async () => {
    if (mode == "buy") {
      const amount = parseFloat(inputAmount) * 100.0;
      const approved = await web3.approve(selectedToken, amount);

      if (!approved) {
        return;
      } else {
        setApproved(true);
      }

      const onConfirmation = async (receipt) => {
        setConfirmed(true);

        const response = await post(`/transactions`, {
          token_address: selectedToken,
          amount: parseFloat(inputAmount),
          block_id: receipt.blockHash,
          transaction_id: receipt.transactionHash,
          inbound: true,
        });
        if (response.error) {
          console.log(response.error);
        } else {
          setDone(true);
        }
      };

      await web3.buy(
        selectedToken,
        amount,
        (receipt) => onConfirmation(receipt),
        (e) => console.log(e),
        () => setRequested(true)
      );
    } else {
      const amount = parseFloat(inputAmount) * 100.0;

      setApproved(true);
      setRequested(true);

      const onConfirmation = async (receipt) => {
        setConfirmed(true);

        const response = await post(`/transactions`, {
          token_address: selectedToken,
          amount: parseFloat(outputAmount),
          block_id: receipt.blockHash,
          transaction_id: receipt.transactionHash,
          inbound: false,
        });
        if (response.error) {
          console.log(response.error);
        } else {
          setDone(true);
        }
      };

      await web3.sell(
        selectedToken,
        amount,
        (receipt) => onConfirmation(receipt),
        (e) => console.log(e),
        () => setRequested(true)
      );
    }
  };

  return (
    <section className="col-12 mx-auto d-flex flex-column justify-content-center lg-overflow-y-scroll pt-3 h-100">
      <form
        onSubmit={onSubmit}
        className="d-flex flex-column border rounded-sm p-4 mx-auto registration-box"
        style={{ maxWidth: 500 }}
      >
        <h5 className="text-center">Talent DEX</h5>
        <div className="d-flex flex-column justify-content-between align-items-start border rounded-sm px-3 py-2">
          <small className="text-muted">From</small>
          <div className="d-flex flex-row justify-content-between align-items-center form-group mb-0 w-100">
            {mode != "buy" && (
              <TokenSelection
                selectedToken={inputToken()}
                tokens={web3.tokens}
                setToken={onInputTokenSet}
                uniqueId="input-swap"
                loading={web3.loading}
              />
            )}
            {mode == "buy" && <strong className="text-secondary">$TAL</strong>}
            <input
              className="text-right form-control ml-2 my-2 bt-md-0"
              inputMode="decimal"
              type="text"
              placeholder="0.0"
              minLength="1"
              maxLength="79"
              onChange={(e) =>
                onTextChange({
                  value: e.target.value,
                  token: inputToken(),
                  tokenChange: setInputAmount,
                  max: inputToken().balance,
                  otherToken: outputToken(),
                  otherTokenChange: setOutputAmount,
                })
              }
              value={inputAmount}
            />
          </div>
          <div className="d-flex flex-row justify-content-between align-items-center w-100">
            <small className="text-muted">Balance </small>
            <small>
              {web3.loading ? <AsyncValue /> : inputToken().balance || 0.0}
            </small>
          </div>
        </div>
        <button
          type="button"
          onClick={changeMode}
          className="mt-2 border-0 bg-transparent"
        >
          <FontAwesomeIcon icon={faExchangeAlt} transform={{ rotate: 90 }} />
        </button>
        <div className="d-flex flex-column justify-content-between align-items-start mt-2 border rounded-sm px-3 py-2">
          <small className="text-muted">To</small>
          <div className="d-flex flex-row justify-content-between align-items-center form-group mb-0 w-100">
            {mode == "buy" && (
              <TokenSelection
                selectedToken={outputToken()}
                tokens={web3.tokens}
                setToken={onOutputTokenSet}
                uniqueId="output-swap"
                loading={web3.loading}
              />
            )}
            {mode != "buy" && <strong className="text-secondary">$TAL</strong>}
            <input
              className="text-right form-control ml-md-2 my-2 bt-md-0"
              inputMode="decimal"
              type="text"
              placeholder="0.0"
              minLength="1"
              maxLength="79"
              onChange={(e) =>
                onTextChange({
                  value: e.target.value,
                  token: outputToken(),
                  tokenChange: setOutputAmount,
                  max: outputToken.balance,
                  otherToken: inputToken(),
                  otherTokenChange: setInputAmount,
                })
              }
              value={outputAmount}
            />
          </div>
          <div className="d-flex flex-row justify-content-between align-items-center w-100">
            <small className="text-muted">Balance </small>
            <small>
              {web3.loading ? <AsyncValue /> : outputToken().balance || 0.0}
            </small>
          </div>
        </div>
        <TradeModal
          show={trading}
          onFinish={onFinish}
          mode={mode}
          trackToken={trackToken}
          transact={transact}
          approved={approved}
          requested={requested}
          confirmed={confirmed}
          done={done}
        />
        <button
          type="submit"
          disabled={buttonDisabled()}
          className="btn btn-primary talent-button mt-3"
        >
          {trading ? "Trading.." : "Trade"}
        </button>
      </form>
    </section>
  );
};

const ConnectedSwap = (props) => (
  <Web3Container>
    <Swap {...props} />
  </Web3Container>
);

export default ConnectedSwap;
