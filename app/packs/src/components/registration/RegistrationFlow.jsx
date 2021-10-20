import React, { useState } from "react";

import Welcome from "./Welcome";
import ProcessFlow from "./ProcessFlow";

const STEPS = {
  1: "Welcome",
  2: "ProcessFlow",
};

const renderCurrentStep = (currentStep) => {
  switch (currentStep) {
    case 1:
      return Welcome;
    case 2:
      return ProcessFlow;
    default:
      return Welcome;
  }
};

const RegistrationFlow = (props) => {
  const [currentStep, setCurrentSet] = useState(props.step ? props.step : 1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");

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
          changePassword={setPassword}
          email={email}
          password={password}
          username={username}
          changeUsername={setUsername}
          code={code}
          changeCode={setCode}
          {...props}
        />
      </div>
    </div>
  );
};

export default RegistrationFlow;
