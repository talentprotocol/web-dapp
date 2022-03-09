import React from "react";
import { LogoWord } from "../icons";
import { H1 } from "../design_system/typography";
import { useWindowDimensionsHook } from "../../utils/window";

const RegistrationStaticScreen = () => {
  const { mobile } = useWindowDimensionsHook();

  return (
    <>
      {!mobile && (
        <>
          <div className="p-0 registration-left-screen"></div>
          <div className="registration-logo">
            <LogoWord
              logoFill="white"
              viewBox="0 0 148 20"
              width="148"
              heigth="20"
            />
          </div>
          <div className="registration-talent-text permanent-text-white">
            <H1 className="d-inline" text="Support" bold />
            <H1
              className="d-inline text-yellow"
              text=" undiscovered talent"
              bold
            />
            <H1 className="d-inline" text=" and be rewarded as they" bold />
            <H1 className="d-inline text-yellow" text=" grow." bold />
          </div>
        </>
      )}
    </>
  );
};

export default RegistrationStaticScreen;
