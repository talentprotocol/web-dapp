import React, { useState, useContext } from "react";

import MetamaskFox from "images/metamask-fox.svg";

import Web3Container, { Web3Context } from "src/contexts/web3Context";

const ConnectMetamask = ({ metamaskSubmit, changeStep }) => {
  const [requestingMetamask, setRequestingMetamask] = useState("false");
  const web3 = useContext(Web3Context);

  const connectMetamask = (e) => {
    e.preventDefault();

    setRequestingMetamask("true");
    if (web3.provider) {
      web3.provider
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          if (accounts.length > 0) {
            return web3.provider
              .request({
                method: "wallet_watchAsset",
                params: {
                  type: "ERC20",
                  options: {
                    address: web3.talToken.contract._address,
                    symbol: "TAL",
                    decimals: 18,
                    image: document.location.origin + "/tal.png",
                  },
                },
              })
              .then(() => {
                metamaskSubmit(accounts[0]);
                setRequestingMetamask("false");
                changeStep(6);
              });
          }
        });
    }
  };

  const allowConnect = () => {
    requestingMetamask == "false" && web3.provider !== null;
  };

  return (
    <div className="d-flex flex-column" style={{ maxWidth: 400 }}>
      <h6 className="registration_step_subtitle">Step 4 of 4</h6>
      <h1>Connect Metamask</h1>
      <p>All that's left is to connect your metamask to your account.</p>
      <form onSubmit={connectMetamask} className="d-flex flex-column">
        <button
          disable={allowConnect()}
          type="submit"
          className="ml-2 btn btn-primary talent-button"
        >
          Connect <img src={MetamaskFox} height={32} alt="Metamask Fox" />
        </button>
      </form>
    </div>
  );
};

const ConnectedMetamask = (props) => (
  <Web3Container>
    <ConnectMetamask {...props} />
  </Web3Container>
);

export default ConnectedMetamask;
