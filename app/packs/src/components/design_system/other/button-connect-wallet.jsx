import React from "react";
import Metamask from "src/components/icons/Metamask";

const Button = () => {
  return (
    <>
      <button className="button-topbar mr-1">
        <Metamask />
        <strong className="m-2">Connect Wallet</strong>
      </button>
    </>
  );
};

export default Button;
