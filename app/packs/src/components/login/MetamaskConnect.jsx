import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { OnChain } from "src/onchain";

import MetamaskFox from "images/metamask-fox.svg";
import { patch } from "../../utils/requests";

export const NoMetamask = ({ show, hide }) => (
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

const MetamaskConnect = ({ user_id, onConnect }) => {
  const [requestingMetamask, setRequestingMetamask] = useState(false);
  const [account, setAccount] = useState("");
  const [showNoMetamask, setShowNoMetamask] = useState(false);

  const connectMetamask = async (e) => {
    e.preventDefault();

    setRequestingMetamask(true);

    const api = new OnChain();
    const _account = await api.retrieveAccount();

    if (_account) {
      const result = await patch(`/api/v1/users/${user_id}`, {
        wallet_id: _account.toLowerCase(),
      });

      if (result) {
        setAccount(_account);
      }
      onConnect();
      setRequestingMetamask(false);
    } else {
      setRequestingMetamask(false);
      setShowNoMetamask(true);
    }
  };

  const allowConnect = () => requestingMetamask == "false";

  return (
    <>
      <NoMetamask show={showNoMetamask} hide={() => setShowNoMetamask(false)} />
      <small onClick={connectMetamask} disabled={!allowConnect()}>
        {account == "" ? "Connect Wallet" : `${account.substring(0, 8)}`}{" "}
        <img src={MetamaskFox} height={16} alt="Metamask Fox" />
      </small>
    </>
  );
};

export default MetamaskConnect;
