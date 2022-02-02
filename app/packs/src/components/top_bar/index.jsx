import React, { useState, useEffect, useCallback, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import transakSDK from "@transak/transak-sdk";

import MetamaskConnect from "../login/MetamaskConnect";
import { destroy } from "../../utils/requests";

import { OnChain } from "src/onchain";
import { parseAndCommify } from "src/onchain/utils";

import { useWindowDimensionsHook } from "src/utils/window";

import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";
import Notifications from "src/components/notifications";
import UserMenu from "src/components/user_menu";
import LogoLight from "src/components/icons/LogoLight";
import LogoDark from "src/components/icons/LogoDark";
import Tab from "src/components/design_system/tab";
import Button from "src/components/design_system/button";
import MobileUserMenu from "src/components/user_menu/MobileUserMenu";
import { Copy } from "src/components/icons";

const UnreadMessagesIndicator = () => {
  return (
    <div className="position-relative">
      <span
        className="position-absolute badge border border-light rounded-circle bg-danger p-1"
        style={{ height: 0, width: 0, left: -8, top: -12 }}
      >
        &nbsp;
      </span>
    </div>
  );
};

const TransakDone = ({ show, hide }) => (
  <Modal show={show} onHide={hide} centered dialogClassName="remove-background">
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

export const TopBar = ({
  user,
  signOutPath,
  railsContext,
  notifications,
  hasUnreadMessages,
}) => {
  const url = new URL(document.location);
  const [walletConnected, setWalletConnected] = useState(false);
  const [stableBalance, setStableBalance] = useState(0);
  const [account, setAccount] = useState("");
  const { height, width } = useWindowDimensionsHook();
  const [transakDone, setTransakDone] = useState(false);
  const [activeTab, setActiveTab] = useState(url.pathname);
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

  useEffect(() => {
    setActiveTab(url.pathname);
  }, [url.pathname]);

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
    <nav className={`navbar ${theme.mode()} d-flex justify-content-between`}>
      <TransakDone show={transakDone} hide={() => setTransakDone(false)} />
      <div className="d-flex align-items-center" style={{ height: 34 }}>
        <a href="/" className="mr-6" style={{ height: 30 }}>
          {theme.mode() == "light" ? (
            <LogoLight width={128} height={20} />
          ) : (
            <LogoDark width={128} height={20} />
          )}
        </a>
        <Tab
          onClick={() => (window.location.href = "/talent")}
          text="Talent"
          type="white"
          active={activeTab.includes("/talent")}
          className="mr-4"
        />
        <Tab
          onClick={() => (window.location.href = "/portfolio")}
          text="Portfolio"
          type="white"
          active={activeTab === "/portfolio"}
          className="mr-4"
        />
        <Tab
          onClick={() => (window.location.href = "/messages")}
          text="Messages"
          type="white"
          active={activeTab === "/messages"}
        />
        {hasUnreadMessages && <UnreadMessagesIndicator />}
      </div>
      <div className="d-flex" style={{ height: 34 }}>
        {!showConnectButton() && connectedButton("mr-2")}
        {showConnectButton() && metamaskButton()}
        <UserMenu
          user={user}
          copyCodeToClipboard={copyCodeToClipboard}
          toggleTheme={toggleTheme}
          mode={theme.mode()}
          userHasInvitesLeft={userHasInvitesLeft}
          inviteNumbers={inviteNumbers}
          onClickTransak={onClickTransak}
          signOut={signOut}
        />
        <Notifications notifications={notifications} mode={theme.mode()} />
      </div>
    </nav>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer {...props}>
      <TopBar {...props} railsContext={railsContext} />
    </ThemeContainer>
  );
};
