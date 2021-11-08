import React, { useState, useEffect, useCallback } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { patch } from "src/utils/requests";
import { OnChain } from "src/onchain";

import Button from "../../../button";

const Token = ({
  close,
  talent,
  token,
  user,
  updateSharedState,
  profileIsComplete,
  inviteLink,
  railsContext,
  setTokenLaunched,
}) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [deploy, setDeploy] = useState("Loading...");
  const [validChain, setValidChain] = useState(true);
  const [factory, setFactory] = useState(null);
  const [tokenInfo, setTokenInfo] = useState({
    ticker: token.ticker || "",
    max_supply: 1000000,
    price: 5,
  });

  const changeAttribute = (attribute, value) => {
    let realValue = value;
    if (attribute == "ticker") {
      realValue = realValue.replace(/[^A-Z]/g, "");
    }
    setTokenInfo((prevInfo) => ({ ...prevInfo, [attribute]: realValue }));
  };

  const createToken = async (e) => {
    e.preventDefault();

    if (factory) {
      setDeploy("We're waiting for confirmation of a successful deploy");
      const result = await factory.createTalent(user.username, token.ticker);

      if (result) {
        const contractAddress = result.args.token;

        const response = await patch(
          `/api/v1/talent/${talent.id}/tokens/${token.id}`,
          {
            token: {
              contract_id: contractAddress.toLowerCase(),
              deployed: true,
            },
          }
        );

        if (response) {
          setDeploy("We've successfully deployed your token");
          setTokenLaunched(true);
        }
      }
    }
  };

  const setupOnChain = useCallback(async () => {
    const newOnChain = new OnChain(railsContext.contractsEnv);
    let result;

    result = await newOnChain.connectedAccount();

    if (!result) {
      return;
    }

    const validChain = await newOnChain.recognizedChain();
    setValidChain(validChain);

    result = newOnChain.loadFactory();

    if (result) {
      setFactory(newOnChain);
    } else {
      setDeploy("Unable to deploy token");
      return;
    }

    if (token.contract_id) {
      const _token = await newOnChain.getToken(token.contract_id);
      if (_token) {
        setDeploy("Your token is already live");
      } else {
        setDeploy("Deploy your token");
      }
    } else {
      setDeploy("Deploy your token");
    }
  }, []);

  useEffect(() => {
    setupOnChain();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const response = await patch(
      `/api/v1/talent/${talent.id}/tokens/${token.id}`,
      {
        token: {
          ticker: tokenInfo["ticker"],
        },
      }
    ).catch(() => {
      setError(true);
      setSaving(false);
    });

    if (response) {
      if (response.error) {
        setError(true);
      } else {
        updateSharedState((prevState) => ({
          ...prevState,
          token: {
            ...prevState.token,
            ticker: tokenInfo["ticker"],
          },
        }));
      }
    }

    setSaving(false);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    close();
  };

  return (
    <div className="col-md-8 mx-auto d-flex flex-column my-3">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <div className="d-flex flex-row justify-content-between">
            <label htmlFor="ticker">Ticker *</label>
            <label htmlFor="ticker">
              <small className="text-muted">
                {tokenInfo["ticker"]?.length || 0} of 8
              </small>
            </label>
          </div>
          <input
            id="ticker"
            className={`form-control${
              tokenInfo["ticker"].length > 8 ? " border-danger" : ""
            }`}
            maxLength="8"
            placeholder="TAL"
            value={tokenInfo["ticker"]}
            aria-describedby="ticker_help"
            onChange={(e) => changeAttribute("ticker", e.target.value)}
          />
          <small id="ticker_help" className="form-text text-muted">
            Upcase letters only, 3 to 8 characters.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="max_supply">Maximum Supply</label>
          <input
            id="max_supply"
            className="form-control"
            disabled={true}
            onChange={(e) => changeAttribute("max_supply", e.target.value)}
            value={tokenInfo["max_supply"]}
            aria-describedby="max_supply_help"
          />
          <small id="max_supply_help" className="form-text text-muted">
            The maximum number of tokens that can be created. (Can't be changed)
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            className="form-control"
            disabled={true}
            onChange={(e) => changeAttribute("price", e.target.value)}
            value={tokenInfo["price"]}
            aria-describedby="price_help"
          />
          <small id="price_help" className="form-text text-muted">
            $0.1 - The price in $TAL of each token. (Can't be changed)
          </small>
        </div>
        {error && (
          <>
            <p className="text-danger">
              We had some trouble updating your token. The ticker is already
              taken.
            </p>
          </>
        )}
        <p className="my-3">* Field is required.</p>
        <div className="mb-2 d-flex flex-row-reverse align-items-end justify-content-between">
          <button
            type="submit"
            disabled={
              saving ||
              tokenInfo["ticker"].length < 3 ||
              tokenInfo["ticker"].length > 8
            }
            onClick={handleSave}
            className="btn btn-primary talent-button"
          >
            {saving ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Saving
              </>
            ) : (
              "Save"
            )}
          </button>
          <Button type="secondary" text="Cancel" onClick={handleCancel} />
        </div>
      </form>
      <div className="dropdown-divider border-secondary my-3"></div>
      {!validChain && (
        <p>
          You're on the wrong network, please change to the CELO network on your
          metamask.
        </p>
      )}
      {validChain && (
        <p>
          {!profileIsComplete
            ? "You must complete your profile before you can deploy your token."
            : deploy}
        </p>
      )}
      <button
        className="btn btn-primary"
        disabled={
          deploy != "Deploy your token" || !profileIsComplete || !validChain
        }
        onClick={createToken}
      >
        Deploy Your Talent Token{" "}
        {deploy == "We're waiting for confirmation of a successful deploy" && (
          <FontAwesomeIcon icon={faSpinner} spin />
        )}
      </button>
    </div>
  );
};

export default Token;
