import React, { useState } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { patch } from "src/utils/requests";

import Button from "../../../button";

const Token = ({ close, talent, token }) => {
  const [saving, setSaving] = useState(false);
  const [tokenInfo, setTokenInfo] = useState({
    ticker: token.ticker || "",
    max_supply: 100000,
    price: 50,
  });

  const changeAttribute = (attribute, value) => {
    setTokenInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

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
    ).catch(() => setSaving(false));

    if (response) {
      updateSharedState((prevState) => ({
        ...prevState,
        token: {
          ...prevState.token,
          ticker: tokenInfo["ticker"],
        },
      }));
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
            <label htmlFor="ticker">Ticker</label>
            <label htmlFor="ticker">
              <small className="text-muted">
                {tokenInfo["ticker"]?.length || 0} of 8
              </small>
            </label>
          </div>
          <input
            id="ticker"
            className="form-control"
            placeholder="TAL"
            value={tokenInfo["ticker"]}
            aria-describedby="ticker_help"
            onChange={(e) => changeAttribute("ticker", e.target.value)}
          />
          <small id="ticker_help" className="form-text text-muted">
            Upcase letters only. 3 to 8 characters.
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
            $1 - The price in TAL of each token. (Can't be changed)
          </small>
        </div>
        <div className="mb-2 d-flex flex-row-reverse align-items-end justify-content-between">
          <button
            type="submit"
            disabled={saving}
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
    </div>
  );
};

export default Token;
