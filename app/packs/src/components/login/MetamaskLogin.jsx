import React, { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import MetamaskFox from "images/metamask-fox.svg";
import { post, get } from "../../utils/requests";

const MetamaskLogin = ({}) => {
  const [provider, setProvider] = useState(null);
  const [requestingMetamask, setRequestingMetamask] = useState("false");
  const [error, setError] = useState("");

  useEffect(() => {
    detectEthereumProvider({ mustBeMetaMask: true }).then(
      (metamaskProvider) => {
        if (metamaskProvider) {
          setProvider(metamaskProvider);
        }
      }
    );
  });

  const loginWithMetamask = (e) => {
    e.preventDefault();
    let timeoutRef;

    setRequestingMetamask("true");
    if (provider) {
      provider.request({ method: "eth_requestAccounts" }).then((accounts) => {
        if (accounts.length > 0) {
          return get(`/users?wallet_id=${accounts[0]}`).then((result) => {
            if (result.error) {
              setError("404Wallet");
              setRequestingMetamask("false");
            } else {
              timeoutRef = setTimeout(() => setError("PendingMetamask"), 5000);
              return provider
                .request({
                  method: "personal_sign",
                  params: [
                    accounts[0],
                    `We use signatures to authenticate you. Sign this to give us proof that you have access to the address you want to use: ${result.nounce}`,
                  ],
                })
                .then((result) => {
                  clearTimeout(timeoutRef);

                  return post("/session", {
                    signed_message: result,
                    wallet_id: accounts[0],
                  }).then((response) => {
                    if (response.success) {
                      window.location.href = response.success;
                    } else {
                      setError("BadAuth");
                      setRequestingMetamask("false");
                    }
                  });
                })
                .catch(() => {
                  setRequestingMetamask("false");
                });
            }
          });
        }
      });
    }
  };

  const allowConnect = () => requestingMetamask == "false" && provider != null;

  const buttonText = requestingMetamask == "false" ? "Log in" : "Logging in...";

  return (
    <form onSubmit={loginWithMetamask} className="d-flex flex-column">
      {error == "404Wallet" && (
        <p className="text-danger">We don't recognize this wallet address.</p>
      )}
      {error == "BadAuth" && (
        <>
          <p className="text-danger">
            We were unable to verify your signature.
          </p>
          <p className="text-danger">If the problem persists contact us.</p>
        </>
      )}
      {error == "PendingMetamask" && (
        <p className="text-warning">
          Check your metamask for a pending signature request.
        </p>
      )}
      <button
        disabled={!allowConnect()}
        type="submit"
        className="btn btn-primary talent-button"
      >
        {buttonText} <img src={MetamaskFox} height={32} alt="Metamask Fox" />
      </button>
    </form>
  );
};

export default MetamaskLogin;
