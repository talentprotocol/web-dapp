import React, { useState } from "react";

import Welcome from "./Welcome";
import EmailValidation from "./EmailValidation";
import AccountCreation from "./AccountCreation";
import ConnectMetamask from "./ConnectMetamask";
import AccessRequested from "./AccessRequested";
import ProcessFlow from "./ProcessFlow";

const STEPS = {
  1: "Welcome",
  2: "EmailValidation",
  3: "AccountCreation",
  4: "ConnectMetamask",
  5: "AccessRequested",
  6: "ProcessFlow",
};

const renderCurrentStep = (currentStep) => {
  switch (currentStep) {
    case 1:
      return Welcome;
    case 2:
      return EmailValidation;
    case 3:
      return AccountCreation;
    case 4:
      return ConnectMetamask;
    case 5:
      return AccessRequested;
    case 6:
      return ProcessFlow;
    default:
      return Welcome;
  }
};

const RegistrationFlow = (props) => {
  const [currentStep, setCurrentSet] = useState(props.step ? props.step : 1);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [metamaskId, setMetamaskId] = useState("");

  const Component = renderCurrentStep(currentStep);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100 mt-4 mt-lg-0">
      <div
        className="border p-3 p-md-5 registration-box bg-white"
        style={{ minHeight: 200 }}
      >
        <Component
          changeStep={setCurrentSet}
          changeEmail={setEmail}
          email={email}
          username={username}
          changeUsername={setUsername}
          metamaskSubmit={setMetamaskId}
          metamaskId={metamaskId}
          {...props}
        />
      </div>
    </div>
  );
};

export default RegistrationFlow;
