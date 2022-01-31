import React, { useContext } from "react";
import LogoLight from "src/components/icons/LogoLight";
import LogoDark from "src/components/icons/LogoDark";
import Talent from "src/components/icons/Talent";
import Wallet from "src/components/icons/Wallet";
import Chat from "src/components/icons/Chat";

import SideBarItem from "./SideBarItem";

import { useWindowDimensionsHook } from "src/utils/window";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

const UnreadMessagesIndicator = () => {
  return (
    <div class="position-relative">
      <span
        class="position-absolute badge border border-light rounded-circle bg-danger p-1"
        style={{ height: 0, width: 0, left: 25, top: -30 }}
      >
        &nbsp;
      </span>
    </div>
  );
};

export const SideBar = ({
  talentPath,
  portfolioPath,
  messagesPath,
  hasUnreadMessages,
}) => {
  const { height, width } = useWindowDimensionsHook();
  const theme = useContext(ThemeContext);

  if (width < 992) {
    return null;
  }

  return (
    <div className={`side-nav position-fixed ${theme.mode()}`}>
      <a href="/">
        {theme.mode() === "light" ? (
          <LogoLight className="mt-3 ml-2" />
        ) : (
          <LogoDark className="mt-3 ml-2" />
        )}
      </a>
      <ul className={`menu ${theme.mode()} d-flex flex-column`}>
        <SideBarItem
          mode={theme.mode()}
          url={talentPath}
          secondaryUrl={"/"}
          routeName="Talent"
          Icon={Talent}
        />
        <SideBarItem
          mode={theme.mode()}
          url={portfolioPath}
          routeName="Portfolio"
          Icon={Wallet}
        />
        <SideBarItem
          mode={theme.mode()}
          url={messagesPath}
          routeName="Messages"
          Icon={Chat}
        />
        {hasUnreadMessages && <UnreadMessagesIndicator />}
      </ul>
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer {...props}>
      <SideBar {...props} />
    </ThemeContainer>
  );
};
