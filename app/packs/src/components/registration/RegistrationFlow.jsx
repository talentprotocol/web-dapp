import React, { useState, useMemo } from "react";

import Welcome from "./Welcome";
import RegisterUsername from "./RegisterUsername";
import RegisterPassword from "./RegisterPassword";
import ProcessFlow from "./ProcessFlow";
import RegistrationStaticScreen from "./RegistrationStaticScreen";
import { Sun, Moon } from "../icons";
import { useWindowDimensionsHook } from "../../utils/window";
import cx from "classnames";

const renderCurrentStep = (currentStep) => {
  switch (currentStep) {
    case 1:
      return Welcome;
    case 2:
      return RegisterUsername;
    case 3:
      return RegisterPassword;
    case 4:
      return ProcessFlow;
    default:
      return Welcome;
  }
};

const RegistrationFlow = (props) => {
  const { width } = useWindowDimensionsHook();
  const mobile = width < 992;

  const [currentStep, setCurrentSet] = useState(props.step ? props.step : 1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [currentTheme, setCurrentTheme] = useState(document.body.className);

  const Component = renderCurrentStep(currentStep);

  const toggleTheme = () => {
    const newTheme = currentTheme == "light-body" ? "dark" : "light";

    document.body.className = `${newTheme}-body`;
    setCurrentTheme(`${newTheme}-body`);
  };

  const themePreference = useMemo(() => {
    if (currentTheme == "light-body") {
      return "light";
    } else if (currentTheme == "dark-body") {
      return "dark";
    }
  }, [currentTheme]);

  return (
    <div className="d-flex col-12 w-100 h-100 p-0">
      {!mobile && (
        <>
          {currentTheme === "light-body" && (
            <button
              onClick={toggleTheme}
              className="registration-theme text-black"
            >
              <Sun color="currentColor" />
            </button>
          )}
          {currentTheme === "dark-body" && (
            <button
              onClick={toggleTheme}
              className="registration-theme text-black"
            >
              <Moon color="currentColor" />
            </button>
          )}
        </>
      )}
      <RegistrationStaticScreen />
      <div
        className={cx(
          "d-flex flex-column align-self-center w-100 h-100",
          mobile
            ? "p-4 justify-content-start"
            : "justify-content-center p-0 registration-box",
          currentStep === 4 && "justify-content-center"
        )}
      >
        <Component
          changeStep={setCurrentSet}
          changeEmail={setEmail}
          changePassword={setPassword}
          email={email}
          password={password}
          username={username}
          changeUsername={setUsername}
          code={code}
          changeCode={setCode}
          captcha={captcha}
          setCaptcha={setCaptcha}
          captchaKey={props.captchaKey}
          themePreference={themePreference}
          {...props}
        />
      </div>
    </div>
  );
};

export default RegistrationFlow;
