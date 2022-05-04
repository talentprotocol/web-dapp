import React, { useState } from "react";
import Welcome from "./Welcome";
import RegisterUsername from "./RegisterUsername";
import RegisterPassword from "./RegisterPassword";
import ProcessFlow from "./ProcessFlow";
import RegistrationContainer from "./RegistrationContainer";
import { useTheme } from "../../contexts/ThemeContext";
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
  const { mode } = useTheme();

  const [currentStep, setCurrentSet] = useState(props.step ? props.step : 1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [captcha, setCaptcha] = useState("");

  const Component = renderCurrentStep(currentStep);

  return (
    <div
      className={cx(
        "d-flex flex-column align-self-center",
        mobile
          ? "p-4 justify-content-start w-100 h-100"
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
        themePreference={mode()}
        {...props}
      />
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <RegistrationContainer {...props}>
      <RegistrationFlow {...props} railsContext={railsContext} />
    </RegistrationContainer>
  );
};
