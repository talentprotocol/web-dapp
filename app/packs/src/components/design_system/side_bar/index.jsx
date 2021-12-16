import React from "react";
import LogoLight from "src/components/icons/Logo-Light";
import LogoDark from "src/components/icons/Logo-Dark";
import Talent from "src/components/icons/Talent";
import Wallet from "src/components/icons/Wallet";
import Chat from "src/components/icons/Chat";

import SideBarItem from "./SideBarItem";

const SideBar = ({ mode, talentPath, portfolioPath, messagesPath }) => {
  return (
    <div className={`side-nav position-fixed ${mode}`}>
      {mode === "light" ? (
        <LogoLight className="mt-3 ml-2" />
      ) : (
        <LogoDark className="mt-3 ml-2" />
      )}
      <ul className={`menu ${mode} d-flex flex-column`}>
        <SideBarItem
          mode={mode}
          url={talentPath}
          secondaryUrl={"/"}
          routeName="Talent"
          Icon={Talent}
        />
        <SideBarItem
          mode={mode}
          url={portfolioPath}
          routeName="Portfolio"
          Icon={Wallet}
        />
        <SideBarItem
          mode={mode}
          url={messagesPath}
          routeName="Messages"
          Icon={Chat}
        />
      </ul>
    </div>
  );
};

export default SideBar;
