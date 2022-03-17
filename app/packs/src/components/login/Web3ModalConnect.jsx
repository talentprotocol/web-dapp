import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { OnChain } from "src/onchain";

import MetamaskFox from "images/metamask-fox.svg";
import { patch } from "src/utils/requests";
import { TALENT_PROTOCOL_DISCORD } from "src/utils/constants";
import { shortenAddress } from "src/utils/viewHelpers";

import Button from "src/components/design_system/button";

export const WalletConnectionError = ({ show, hide, mode }) => (
  <Modal show={show} onHide={hide} centered dialogClassName="remove-background">
    <Modal.Header closeButton>
      <Modal.Title>
        Metamask <img src={MetamaskFox} height={32} alt="Metamask Fox" />
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p className={mode}>
        We couldn't find metamask installed on your browser. You can install it{" "}
        <a href="https://metamask.io/download" target="_blank">
          here
        </a>
        .
      </p>
      <p className={mode}>
        If you think this is a mistake and you have metamask installed, reach
        out to us on{" "}
        <a href={TALENT_PROTOCOL_DISCORD} target="_blank">
          Discord
        </a>
        .
      </p>
    </Modal.Body>
  </Modal>
);

export const UnableToConnect = ({ show, hide }) => (
  <Modal show={show} onHide={hide} centered dialogClassName="remove-background">
    <Modal.Header closeButton>
      <Modal.Title>
        Metamask <img src={MetamaskFox} height={32} alt="Metamask Fox" />
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p className="text-danger">
        We already have the public key you tried to connect in our system. We do
        not allow multiple users to use the same wallet, please select a
        different one and try to connect again.
      </p>
    </Modal.Body>
  </Modal>
);

const Web3ModalConnect = ({ user_id, onConnect, railsContext, mode }) => {
  const [requestingWalletConnection, setRequestingWalletConnection] =
    useState(false);
  const [account, setAccount] = useState("");
  const [showWalletConnectionError, setShowWalletConnectionError] =
    useState(false);
  const [error, setError] = useState(false);

  const connectWallet = async (e) => {
    setRequestingWalletConnection(true);

    const api = new OnChain(railsContext.contractsEnv);
    const _account = await api.retrieveAccount();

    if (_account) {
      const result = await patch(`/api/v1/users/${user_id}`, {
        wallet_id: _account.toLowerCase(),
      }).catch((error) => {
        console.log(error);
        setError(true);
      });

      if (result.errors) {
        setError(true);
        setRequestingWalletConnection(false);
      } else {
        if (result) {
          setAccount(_account);
        }
        onConnect(_account);
        setRequestingWalletConnection(false);
      }
    } else {
      setRequestingWalletConnection(false);
      setShowWalletConnectionError(true);
    }
  };

  const allowConnect = () => requestingWalletConnection == false;

  return (
    <>
      <WalletConnectionError
        show={showWalletConnectionError}
        hide={() => setShowWalletConnectionError(false)}
        mode={mode}
      />
      <UnableToConnect show={error} hide={() => setError(false)} />
      <Button
        onClick={connectWallet}
        type="white-subtle"
        mode={mode}
        className="mr-2"
        disabled={!allowConnect()}
      >
        {account == "" ? "Connect Wallet" : `${shortenAddress(account)}`}{" "}
      </Button>
    </>
  );
};

export default Web3ModalConnect;
