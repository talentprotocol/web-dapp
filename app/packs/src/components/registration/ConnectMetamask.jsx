import React, { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";

import MetamaskFox from "images/metamask-fox.svg";

import Web3Container, { Web3Context } from "src/contexts/web3Context";

const NoMetamask = ({ show, hide }) => (
  <Modal show={show} onHide={hide} centered>
    <Modal.Header closeButton>
      <Modal.Title>
        Metamask <img src={MetamaskFox} height={32} alt="Metamask Fox" />
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>
        We couldn't find metamask installed on your browser. You can install it{" "}
        <a href="https://metamask.io/download">here</a>.
      </p>
      <p>
        If you think this is a mistake and you have metamask installed, reach
        out to us on <a href="https://discord.gg/rEXPJZVh">Discord</a>.
      </p>
    </Modal.Body>
  </Modal>
);

const ConnectMetamask = ({ metamaskSubmit, changeStep }) => {
  const [requestingMetamask, setRequestingMetamask] = useState("false");
  const [showNoMetamask, setShowNoMetamask] = useState(true);
  const web3 = useContext(Web3Context);

  const connectMetamask = async (e) => {
    e.preventDefault();

    setRequestingMetamask("true");
    if (web3.provider) {
      const accounts = await web3.provider.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        if (web3.talToken) {
          await web3.provider.request({
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
          });
        }
        metamaskSubmit(accounts[0]);
        setRequestingMetamask("false");
        changeStep(6);
      }
    }
  };

  const allowConnect = () =>
    web3.loading == false &&
    requestingMetamask == "false" &&
    web3.provider != null;

  return (
    <div className="d-flex flex-column" style={{ maxWidth: 400 }}>
      <h6 className="registration_step_subtitle">Step 4 of 4</h6>
      <h1>Connect Metamask</h1>
      <p>
        Click the Connect button below. When the MetaMask browser extension
        opens, select the Ropsten Test Network from the dropdown button. Add
        suggested token $TAL.
      </p>
      {web3.loading == false && web3.provider == null && (
        <NoMetamask
          show={showNoMetamask}
          hide={() => setShowNoMetamask(false)}
        />
      )}
      <form onSubmit={connectMetamask} className="d-flex flex-column">
        <button
          disabled={!allowConnect()}
          type="submit"
          className="btn btn-primary talent-button"
        >
          {web3.loading ? "Loading..." : "Connect"}{" "}
          <img src={MetamaskFox} height={32} alt="Metamask Fox" />
        </button>
      </form>
    </div>
  );
};

const ConnectedMetamask = (props) => (
  <Web3Container ignoreTokens={true}>
    <ConnectMetamask {...props} />
  </Web3Container>
);

export default ConnectedMetamask;
