import React from "react";
import { LogoWord } from "../icons";
import { H1 } from "../design_system/typography";
import { useWindowDimensionsHook } from "../../utils/window";

const RegistrationStaticScreen = () => {
  const { width } = useWindowDimensionsHook();
  const mobile = width < 992;

  return (
    <>
      {!mobile && (
        <>
          <div className="p-0 w-100 registration-left-screen"></div>
          <div className="registration-logo">
            <LogoWord />
          </div>
          <div className="registration-talent-text text-white">
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
