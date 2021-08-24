import React, { useState, useContext, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Web3Container, { Web3Context } from "src/contexts/web3Context";
import { post } from "src/utils/requests";

const TokenSelection = ({ uniqueId, selectedToken, tokens, setToken }) => {
  const tokenArray = Object.keys(tokens).map((address) => tokens[address]);
  return (
    <Dropdown>
      <Dropdown.Toggle
        className="tal-nav-dropdown-btn"
        variant="primary"
        id="dropdown-basic"
      >
        {selectedToken.symbol ? `$${selectedToken.symbol}` : "Select"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {tokenArray.map((otherToken) => (
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
  const [tradeText, setTradeText] = useState("Trade");
  const [approveText, setApproveText] = useState("Approve");
  const [mode, setMode] = useState("buy");
  const [selectedToken, setSelectedToken] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");

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

  const buttonDisabled = () =>
    !(parseFloat(inputAmount) > 0.0 && parseFloat(outputAmount) > 0.0) ||
    tradeText != "Trade";

  const approveTal = () => {
    if (mode != "buy") {
      setApproveText("No approve required.");
      setTimeout(() => setApproveText("Approve"), 1000);
    } else {
      const amount = parseFloat(inputAmount) * 100.0;
      web3.approve(selectedToken, amount).then((approved) => {
        if (approved) {
          setApproveText("Approved");
        } else {
          setApproveText("Not Approved");
        }
        setTimeout(() => setApproveText("Approve"), 1000);
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (mode == "buy") {
      const amount = parseFloat(inputAmount) * 100.0;
      const assumeAlreadyTracking = web3.tokens[selectedToken].balance > 0;
      setTradeText("Trading...");
      web3.buy(selectedToken, amount).then((result) => {
        setInputAmount("");
        setOutputAmount("");

        if (!assumeAlreadyTracking) {
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
        }

        post(`/transactions`, {
          token_address: selectedToken,
          amount: parseFloat(inputAmount),
          block_id: result.blockHash,
          transaction_id: result.transactionHash,
          inbound: true,
        }).then((response) => {
          if (response.error) {
            console.log(response.error);
          } else {
            setInputAmount("");
            setOutputAmount("");
          }
          setTradeText("Trade");
        });
      });
    } else {
      const amount = parseFloat(inputAmount) * 100.0;

      setTradeText("Trading...");

      web3.sell(selectedToken, amount).then((result) => {
        post(`/transactions`, {
          token_address: selectedToken,
          amount: parseFloat(inputAmount),
          block_id: result.blockHash,
          transaction_id: result.transactionHash,
          inbound: false,
        }).then((response) => {
          if (response.error) {
            console.log(response.error);
          } else {
            setInputAmount("");
            setOutputAmount("");
          }
          setTradeText("Trade");
        });
      });
    }
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

  const changeMode = () => {
    setMode(mode == "buy" ? "sell" : "buy");
  };

  return (
    <section className="col-12 mx-auto d-flex flex-column justify-content-center lg-overflow-y-scroll pt-3 h-100">
      <form
        onSubmit={onSubmit}
        className="d-flex flex-column border rounded-sm p-4 mx-auto registration-box"
        style={{ maxWidth: 500 }}
      >
        <h5 className="text-center">Talent DEX</h5>
        <div className="d-flex flex-column justify-content-between align-items-center border rounded-sm px-3 py-2">
          {mode != "buy" && (
            <TokenSelection
              selectedToken={inputToken()}
              tokens={web3.tokens}
              setToken={onInputTokenSet}
              uniqueId="input-swap"
            />
          )}
          {mode == "buy" && "$TAL"}
          <div className="d-flex flex-column align-items-end form-group mb-0">
            <input
              className="text-right form-control ml-2 mt-2 bt-md-0"
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
            <small className="text-muted">
              Balance {inputToken().balance || 0.0}
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
        <div className="d-flex flex-column justify-content-between align-items-center mt-2 border rounded-sm px-3 py-2">
          {mode == "buy" && (
            <TokenSelection
              selectedToken={outputToken()}
              tokens={web3.tokens}
              setToken={onOutputTokenSet}
              uniqueId="output-swap"
            />
          )}
          {mode != "buy" && "$TAL"}
          <div className="d-flex flex-column align-items-end form-group mb-0">
            <input
              className="text-right form-control ml-md-2 mt-2 bt-md-0"
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
            <small className="text-muted">
              Balance {outputToken().balance}
            </small>
          </div>
        </div>
        <button
          type="button"
          onClick={approveTal}
          disabled={buttonDisabled()}
          className="btn btn-primary talent-button mt-3"
        >
          {approveText}
        </button>
        <button
          type="submit"
          disabled={buttonDisabled()}
          className="btn btn-primary talent-button mt-3"
        >
          {tradeText}
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
