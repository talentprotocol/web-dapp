import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { OnChain } from "src/onchain";

import MetamaskFox from "images/metamask-fox.svg";
import { patch } from "../../utils/requests";

import Button from "src/components/design_system/button";

export const NoMetamask = ({ show, hide }) => {
  const openMetamaskDownload = () =>
    window.open("https://metamask.io/download", "_blank").focus();
  const openDiscordLink = () =>
    window.open("https://discord.gg/DMgt9bhawK", "_blank").focus();
  return (
    <Modal show={show} onHide={hide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Metamask <img src={MetamaskFox} height={32} alt="Metamask Fox" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          We couldn't find metamask installed on your browser. You can install
          it{" "}
          <a href="https://metamask.io/download" onClick={openMetamaskDownload}>
            here
          </a>
          .
        </p>
        <p>
          If you think this is a mistake and you have metamask installed, reach
          out to us on{" "}
          <a href="https://discord.gg/DMgt9bhawK" onClick={openDiscordLink}>
            Discord
          </a>
          .
        </p>
      </Modal.Body>
    </Modal>
  );
};

export const UnableToConnect = ({ show, hide }) => (
  <Modal show={show} onHide={hide} centered>
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

const MetamaskConnect = ({ user_id, onConnect, railsContext, mode }) => {
  const [requestingMetamask, setRequestingMetamask] = useState(false);
  const [account, setAccount] = useState("");
  const [showNoMetamask, setShowNoMetamask] = useState(false);
  const [error, setError] = useState(false);

  const connectMetamask = async (e) => {
    setRequestingMetamask(true);

    const api = new OnChain(railsContext.contractsEnv);
    const _account = await api.retrieveAccount();

    if (_account) {
      const result = await patch(`/api/v1/users/${user_id}`, {
        wallet_id: _account.toLowerCase(),
      }).catch(() => setError(true));

      if (result.error) {
        setError(true);
      } else {
        if (result) {
          setAccount(_account);
        }
        onConnect(_account);
        setRequestingMetamask(false);
      }
    } else {
      setRequestingMetamask(false);
      setShowNoMetamask(true);
    }
  };

  const allowConnect = () => requestingMetamask == false;

  return (
    <>
      <NoMetamask show={showNoMetamask} hide={() => setShowNoMetamask(false)} />
      <UnableToConnect show={error} hide={() => setError(false)} />
      <Button
        onClick={connectMetamask}
        type="white-subtle"
        mode={mode}
        className="mr-2"
        disabled={!allowConnect()}
      >
        <img
          src={MetamaskFox}
          height={16}
          alt="Metamask Fox"
          className="mr-2"
        />
        {account == "" ? "Connect Wallet" : `${account.substring(0, 10)}...`}{" "}
      </Button>
    </>
  );
};

export default MetamaskConnect;
