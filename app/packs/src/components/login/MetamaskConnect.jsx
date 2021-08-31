import React, { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";

import MetamaskFox from "images/metamask-fox.svg";
import { patch } from "../../utils/requests";

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

const MetamaskConnect = ({ user_id }) => {
  const [requestingMetamask, setRequestingMetamask] = useState("false");
  const [connected, setConnected] = useState(false);
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
        const result = await patch(`/api/v1/users/${user_id}`, {
          wallet_id: accounts[0],
        });

        if (result) {
          web3.connectAccount(accounts[0]);
          setConnected(true);
        }
        setRequestingMetamask("false");
      }
    }
  };

  const allowConnect = () =>
    web3.loading == false &&
    requestingMetamask == "false" &&
    web3.provider != null;

  return (
    <>
      {web3.loading == false && web3.provider == null && (
        <NoMetamask
          show={showNoMetamask}
          hide={() => setShowNoMetamask(false)}
        />
      )}
      <button
        disabled={!allowConnect()}
        onClick={connectMetamask}
        className="btn btn-primary talent-button"
      >
        {connected
          ? "Connected"
          : web3.loading
          ? "Loading..."
          : "Connect Wallet"}{" "}
        <img src={MetamaskFox} height={32} alt="Metamask Fox" />
      </button>
    </>
  );
};

const MetamaskConnected = (props) => (
  <Web3Container ignoreTokens={true}>
    <MetamaskConnect {...props} />
  </Web3Container>
);

export default MetamaskConnected;
