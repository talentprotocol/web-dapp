import React, { useContext } from "react";
import LogoLight from "src/components/icons/Logo-Light";
import LogoDark from "src/components/icons/Logo-Dark";
import Talent from "src/components/icons/Talent";
import Wallet from "src/components/icons/Wallet";
import Chat from "src/components/icons/Chat";
import cx from "classnames";

import SideBarItem from "./SideBarItem";

import { useWindowDimensionsHook } from "src/utils/window";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

export const SideBar = ({ talentPath, portfolioPath, messagesPath }) => {
  const { height, width } = useWindowDimensionsHook();
  const theme = useContext(ThemeContext);

  if (width < 992) {
    return null;
  }

  return (
    <div className={`side-nav position-fixed ${theme.mode()}`}>
      {theme.mode() === "light" ? (
        <LogoLight className="mt-3 ml-2" />
      ) : (
        <LogoDark className="mt-3 ml-2" />
      )}
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
