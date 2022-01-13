import React from "react";
import { useWindowDimensionsHook } from "../../utils/window";
import ThemeContainer, { useTheme } from "../../contexts/ThemeContext";
import RegistrationStaticScreen from "./RegistrationStaticScreen";
import { Sun, Moon, Padlock, LogoWord } from "../icons";
import { P3 } from "../design_system/typography";
import cx from "classnames";

const RegistrationContainer = ({ children }) => {
  const { mobile } = useWindowDimensionsHook();
  const { theme, simpleToggleTheme, mode } = useTheme();

  return (
    <div className="h-100">
      {!mobile && (
        <>
          {theme === "light-body" && (
            <button
              onClick={simpleToggleTheme}
              className="registration-theme z-index-1 text-black"
            >
              <Sun color="currentColor" />
            </button>
          )}
          {theme === "dark-body" && (
            <button
              onClick={simpleToggleTheme}
              className="registration-theme z-index-1 text-black"
            >
              <Moon color="currentColor" />
            </button>
          )}
        </>
      )}
      {mobile && (
        <div className="registration-mobile-menu position-fixed z-index-1 text-black w-100">
          <div className="d-flex justify-content-between px-4 pt-4 pb-2">
            <LogoWord
              logoFill="#7a55ff"
              textFill="currentColor"
              viewBox="0 0 250 20"
            />
            {theme === "light-body" && (
              <button
                onClick={simpleToggleTheme}
                className="remove-border remove-background text-black"
              >
                <Sun color="currentColor" />
              </button>
            )}
            {theme === "dark-body" && (
              <button
                onClick={simpleToggleTheme}
                className="remove-border remove-background text-black"
              >
                <Moon color="currentColor" />
              </button>
            )}
          </div>
          <div className="url-verification-container">
            <Padlock size={16} color="#1db954" />
            <P3 className="text-black mx-1" text="URL Verification:" bold />
            <P3 className="text-green-500" text="https://" />
            <P3 className="text-black" text="beta.talentprotocol.com" />
          </div>
        </div>
      )}
      <div
        className={cx(
          "d-flex col-12 w-100 h-100 p-0",
          mobile && "registration-mobile"
        )}
      >
        <RegistrationStaticScreen />
        {children}
      </div>
    </div>
  );
};

export default (props, _railsContext) => (
  <ThemeContainer {...props}>
    <RegistrationContainer {...props} />
  </ThemeContainer>
);
