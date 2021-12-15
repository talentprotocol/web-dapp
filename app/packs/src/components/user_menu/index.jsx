import React, { useState, useEffect, useCallback } from "react";
import { Dropdown } from "react-bootstrap";
import TalentProfilePicture from "../talent/TalentProfilePicture";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import {
  faAngleDown,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import transakSDK from "@transak/transak-sdk";

import MetamaskConnect from "../login/MetamaskConnect";
import { destroy } from "../../utils/requests";
import EditInvestorProfilePicture from "./EditInvestorProfilePicture";

import { OnChain } from "src/onchain";
import { parseAndCommify } from "src/onchain/utils";

import { useWindowDimensionsHook } from "src/utils/window";
import { SUPPORTER_GUIDE, TALENT_GUIDE } from "src/utils/constants";

const TransakDone = ({ show, hide }) => (
  <Modal show={show} onHide={hide} centered>
    <Modal.Header closeButton>
      <Modal.Title>Thank you for your support</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>
        You have successfully acquired cUSD on the CELO network. It usually
        takes a couple minutes to finish processing and for you to receive your
        funds, you'll get a confirmation email from transak once you do. After
        that you're ready to start supporting talent!
      </p>
    </Modal.Body>
  </Modal>
);

const newTransak = (width, height, env, apiKey) => {
  const envName = env ? env.toUpperCase() : "STAGING";

  return new transakSDK({
    apiKey: apiKey, // Your API Key
    environment: envName, // STAGING/PRODUCTION
    defaultCryptoCurrency: "CUSD",
    fiatCurrency: "EUR",
    defaultPaymentMethod: "credit_debit_card",
    themeColor: "000000",
    hostURL: window.location.origin,
    widgetHeight: `${height}px`,
    widgetWidth: `${width}px`,
    network: "CELO",
    cryptoCurrencyList: "CUSD",
  });
};

export const UserMenuUnconnected = ({ user, signOutPath, railsContext }) => {
  const [show, setShow] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [stableBalance, setStableBalance] = useState(0);
  const [account, setAccount] = useState("");
  const { height, width } = useWindowDimensionsHook();
  const [transakDone, setTransakDone] = useState(false);

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(user.walletId);
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}${user.sign_up_path}`
    );
  };

  const onClickTransak = (e) => {
    e.preventDefault();

    const _width = width > 450 ? 450 : width;
    const _height = height > 700 ? 700 : height;

    const transak = newTransak(
      _width,
      _height,
      railsContext.contractsEnv,
      railsContext.transakApiKey
    );
    transak.init();

    // To get all the events
    transak.on(transak.ALL_EVENTS, (data) => {
      console.log(data);
    });

    // This will trigger when the user marks payment is made.
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      transak.close();
      setTransakDone(true);
    });
  };

  const signOut = () => {
    destroy(signOutPath).then(() => {
      window.location.replace("/");
    });
  };

  const setupChain = useCallback(async () => {
    const onChain = new OnChain(railsContext.contractsEnv);

    const account = await onChain.connectedAccount();

    if (account) {
      setAccount(account.toLowerCase());
      setWalletConnected(true);

      await onChain.loadStableToken();
      const balance = await onChain.getStableBalance(true);

      if (balance) {
        setStableBalance(balance);
      }
    }
  }, [walletConnected]);

  const onWalletConnect = async (account) => {
    await setupChain();

    if (account) {
      setAccount(account.toLowerCase());
    }
  };

  useEffect(() => {
    setupChain();
  }, []);

  const showConnectButton = () => {
    if (!account || !user.walletId) {
      return true;
    } else if (account != user.walletId) {
      return true;
    } else {
      return false;
    }
  };

  const showInviteCodeButton = () => user.tokenLive && user.invitesLeft > 0;

  const inviteNumbers = () => {
    if (!user.totalInvites) {
      return null;
    } else {
      return ` (${user.invitesLeft}/${user.totalInvites})`;
    }
  };

  return (
    <>
      <TransakDone show={transakDone} hide={() => setTransakDone(false)} />
      <Dropdown className="">
        <Dropdown.Toggle
          className="user-menu-dropdown-btn no-caret"
          id="user-dropdown"
        >
          <TalentProfilePicture
            src={user.profilePictureUrl}
            height={20}
            className="mr-2"
          />
          <small className="mr-2">{user.username}</small>
          <FontAwesomeIcon icon={faAngleDown} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {!showConnectButton() && (
            <Dropdown.Item
              key="tab-dropdown-address"
              onClick={copyAddressToClipboard}
              className="d-flex flex-row justify-content-between align-items-center"
            >
              <div>
                <small className="text-black">Address: </small>
                <small className="text-secondary">{user.displayWalletId}</small>
              </div>
              <FontAwesomeIcon icon={faCopy} className="ml-2" />
            </Dropdown.Item>
          )}
          {showConnectButton() && (
            <Dropdown.Item key="tab-dropdown-connect-wallet">
              <MetamaskConnect
                user_id={user.id}
                onConnect={onWalletConnect}
                railsContext={railsContext}
              />
            </Dropdown.Item>
          )}
          <Dropdown.ItemText key="tab-dropdown-balance">
            <small className="text-black">Balance: </small>
            <small className="text-secondary">
              {parseAndCommify(stableBalance)}
            </small>
            <small className="text-secondary ml-1">cUSD</small>
          </Dropdown.ItemText>
          {showInviteCodeButton() && (
            <Dropdown.Item
              key="tab-dropdown-invite-code"
              onClick={copyCodeToClipboard}
              className="d-flex flex-row justify-content-between"
            >
              <small className="text-black">Invite link{inviteNumbers()}</small>
              <FontAwesomeIcon icon={faCopy} className="ml-2" />
            </Dropdown.Item>
          )}
          <Dropdown.Item
            key="tab-dropdown-get-funds"
            className="text-black"
            onClick={onClickTransak}
          >
            <small>Get funds</small>
          </Dropdown.Item>
          {user.isTalent ? (
            <Dropdown.Item
              key="tab-dropdown-my-profile"
              className="text-black"
              href={`/talent/${user.username}`}
            >
              <small>My profile</small>
            </Dropdown.Item>
          ) : (
            <Dropdown.Item
              key="tab-dropdown-change-investor-image"
              className="text-black"
              onClick={() => setShow(true)}
            >
              <small>Change profile picture</small>
            </Dropdown.Item>
          )}
          <Dropdown.Divider />
          <Dropdown.Item
            key="tab-dropdown-user-guide"
            className="text-black d-flex flex-row justify-content-between"
            target="self"
            href={user.isTalent ? TALENT_GUIDE : SUPPORTER_GUIDE}
          >
            <small>User guide</small>
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              className="ml-2"
              size="sm"
            />
          </Dropdown.Item>
          <Dropdown.Item
            key="tab-dropdown-sign-out"
            onClick={signOut}
            className="text-black"
          >
            <small>Sign out</small>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <EditInvestorProfilePicture
        show={show}
        setShow={setShow}
        investorId={user.investorId}
      />
    </>
  );
};

export default (props, railsContext) => {
  return () => <UserMenuUnconnected {...props} railsContext={railsContext} />;
};
