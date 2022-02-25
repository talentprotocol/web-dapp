import React, { useState, useEffect, useCallback, useContext } from "react";
import { useWindowDimensionsHook } from "src/utils/window";
import ThemeContainer, { useTheme } from "src/contexts/ThemeContext";
import { TALENT_PROTOCOL_WEBSITE } from "src/utils/constants";

import { LogoLight, LogoDark, Logo } from "src/components/icons";
import Button from "src/components/design_system/button";
import { Sun, Moon } from "src/components/icons";

export const LoggedOutTopBar = ({}) => {
  const { mobile } = useWindowDimensionsHook();
  const { simpleToggleTheme, mode } = useTheme();

  console.log(mode());
  return (
    <div className="navbar-container">
      <nav className={`navbar d-flex justify-content-between`}>
        <div className="d-flex align-items-center" style={{ height: 34 }}>
          {mobile ? (
            <Logo />
          ) : (
            <a href="/" className="mr-6" style={{ height: 30 }}>
              {mode() == "light" ? (
                <LogoLight width={128} height={20} />
              ) : (
                <LogoDark width={128} height={20} />
              )}
            </a>
          )}
        </div>
        <div className="d-flex" style={{ height: 34 }}>
          <Button
            type="primary-default"
            onClick={() => window.open(TALENT_PROTOCOL_WEBSITE)}
            text="Join Waitlist"
          />
          <Button
            type="white-subtle"
            onClick={() => (window.location.href = "/")}
            className="ml-2"
            text="Sign in"
          />
          <Button
            type="white-subtle"
            onClick={simpleToggleTheme}
            className="text-black ml-2"
          >
            {mode() === "light" ? (
              <Moon color="currentColor" />
            ) : (
              <Sun color="currentColor" />
            )}
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer {...props}>
      <LoggedOutTopBar {...props} railsContext={railsContext} />
    </ThemeContainer>
  );
};
