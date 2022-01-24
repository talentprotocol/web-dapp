import React, { useState, useEffect, useCallback, useContext } from "react";
import Dropdown from "react-bootstrap/Dropdown";
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

import { OnChain } from "src/onchain";
import { parseAndCommify } from "src/onchain/utils";

import { useWindowDimensionsHook } from "src/utils/window";
import {
  SUPPORTER_GUIDE,
  TALENT_GUIDE,
  TERMS_HREF,
  PRIVACY_HREF,
} from "src/utils/constants";

import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";
import Notifications from "src/components/notifications";

import Button from "src/components/design_system/button";
import MobileUserMenu from "./MobileUserMenu";
import { P2, P3 } from "src/components/design_system/typography";
import { Copy, Sun, Moon } from "src/components/icons";

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

export const UserMenuUnconnected = ({
  user,
  signOutPath,
  railsContext,
  notifications,
}) => {
  const [show, setShow] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [stableBalance, setStableBalance] = useState(0);
  const [account, setAccount] = useState("");
  const { height, width } = useWindowDimensionsHook();
  const [transakDone, setTransakDone] = useState(false);
  const theme = useContext(ThemeContext);

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

  const inviteNumbers = () => {
    if (!user.invitesLeft) {
      return "";
    }
    if (!user.totalInvites) {
      return `${user.invitesLeft}/*`;
    } else {
      return `${user.invitesLeft}/${user.totalInvites}`;
    }
  };

  const toggleTheme = () => {
    theme.toggleTheme();
  };

  const connectedButton = (extraClasses = "") => (
    <Button
      onClick={copyAddressToClipboard}
      type="white-subtle"
      mode={theme.mode()}
      className={extraClasses}
    >
      <strong>
        {parseAndCommify(stableBalance)} cUSD{" "}
        <span className="text-primary-03">{user.displayWalletId}</span>
        <Copy color="currentColor" className="ml-2" />
      </strong>
    </Button>
  );

  const userHasInvitesLeft = user.invitesLeft > 0;

  const metamaskButton = () => (
    <MetamaskConnect
      user_id={user.id}
      onConnect={onWalletConnect}
      railsContext={railsContext}
      mode={theme.mode()}
    />
  );

  if (width < 992) {
    return (
      <MobileUserMenu
        mode={theme.mode()}
        notifications={notifications}
        user={user}
        toggleTheme={toggleTheme}
        showConnectButton={showConnectButton}
        connectedButton={connectedButton}
        metamaskButton={metamaskButton}
        onClickTransak={onClickTransak}
        copyCodeToClipboard={copyCodeToClipboard}
        inviteNumbers={inviteNumbers()}
        userHasInvitesLeft={userHasInvitesLeft}
        signOut={signOut}
      />
    );
  }

  return (
    <nav className={`navbar ${theme.mode()} justify-content-end`}>
      <TransakDone show={transakDone} hide={() => setTransakDone(false)} />
      {!showConnectButton() && connectedButton("mr-2")}
      {showConnectButton() && metamaskButton()}
      <Dropdown>
        <Dropdown.Toggle
          className="talent-button white-subtle-button normal-size-button no-caret d-flex align-items-center"
          id="user-dropdown"
          bsPrefix=""
          as="div"
        >
          <TalentProfilePicture
            src={user.profilePictureUrl}
            height={20}
            className="mr-2"
          />
          <P2
            bold
            text={user.username}
            className="mr-2 align-middle text-black"
          />
          <FontAwesomeIcon icon={faAngleDown} className="align-middle" />
        </Dropdown.Toggle>

        <Dropdown.Menu className="user-menu-dropdown">
          {user.isTalent ? (
            <Dropdown.Item
              key="tab-dropdown-my-profile"
              className="text-black user-menu-dropdown-item"
              href={`/talent/${user.username}`}
            >
              <P3 bold text="My profile" className="text-black" />
            </Dropdown.Item>
          ) : (
            <Dropdown.Item
              key="tab-dropdown-change-investor-image"
              className="text-black user-menu-dropdown-item"
              href="/settings"
            >
              <P3 bold text="My profile" className="text-black" />
            </Dropdown.Item>
          )}
          <Dropdown.Divider className="user-menu-divider m-0" />
          {userHasInvitesLeft && (
            <Dropdown.Item
              key="tab-dropdown-invite-code"
              onClick={copyCodeToClipboard}
              className="d-flex flex-row justify-content-between align-items-center user-menu-dropdown-item"
              disabled={user.invitesLeft == null && user.totalInvites == null}
            >
              <div className="d-flex">
                <P3 bold text="Share invite link" className="text-black mr-1" />
                <P3 bold text={inviteNumbers()} />
              </div>
              <FontAwesomeIcon icon={faCopy} className="ml-2 text-black" />
            </Dropdown.Item>
          )}
          <Dropdown.Divider className="user-menu-divider m-0" />
          <Dropdown.Item
            key="tab-dropdown-theme"
            className="text-black d-flex flex-row justify-content-between align-items-center user-menu-dropdown-item"
            onClick={toggleTheme}
          >
            <P3
              bold
              text={`${theme.mode() === "light" ? "Dark" : "Light"} mode`}
              className="text-black"
            />
            {theme.mode() == "light" ? (
              <Moon color="currentColor" />
            ) : (
              <Sun color="currentColor" />
            )}
          </Dropdown.Item>
          <Dropdown.Divider className="user-menu-divider m-0" />
          <Dropdown.Item
            key="tab-dropdown-t-c"
            className="text-black d-flex flex-row justify-content-between user-menu-dropdown-item"
            onClick={() => window.open(TERMS_HREF, "_blank")}
          >
            <P3 bold text="Terms & Conditions" className="text-black" />
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              className="ml-2"
              size="sm"
            />
          </Dropdown.Item>
          <Dropdown.Item
            key="tab-dropdown-user-guide"
            className="text-black d-flex flex-row justify-content-between user-menu-dropdown-item"
            target="self"
            href={user.isTalent ? TALENT_GUIDE : SUPPORTER_GUIDE}
          >
            <P3 bold text="User guide" className="text-black" />
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              className="ml-2"
              size="sm"
            />
          </Dropdown.Item>
          <Dropdown.Item
            key="tab-dropdown-p-h"
            className="text-black d-flex flex-row justify-content-between user-menu-dropdown-item"
            onClick={() => window.open(PRIVACY_HREF, "_blank")}
          >
            <P3 bold text="Privacy Policy" className="text-black" />
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              className="ml-2"
              size="sm"
            />
          </Dropdown.Item>
          <Dropdown.Divider className="user-menu-divider m-0" />
          <Dropdown.Item
            key="tab-dropdown-sign-out"
            onClick={signOut}
            className="text-black user-menu-dropdown-item mt-0"
          >
            <P3 bold text="Sign out" className="text-black" />
          </Dropdown.Item>
          <Button
            onClick={onClickTransak}
            type="primary-default"
            className="w-100 my-2"
          >
            <P3 bold text="Get funds" className="text-white" />
          </Button>
        </Dropdown.Menu>
      </Dropdown>
      <Notifications notifications={notifications} mode={theme.mode()} />
    </nav>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer {...props}>
      <UserMenuUnconnected {...props} railsContext={railsContext} />
    </ThemeContainer>
  );
};
