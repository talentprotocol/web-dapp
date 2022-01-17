import React, { useState } from "react";
import RegistrationContainer from "../registration/RegistrationContainer";
import TextInput from "../design_system/fields/textinput";
import Link from "../design_system/link";
import { useTheme } from "../../contexts/ThemeContext";
import { useWindowDimensionsHook } from "../../utils/window";
import { Envelope } from "../icons";
import { H5, P2 } from "../design_system/typography";
import { post } from "../../utils/requests";
import cx from "classnames";

const ResetPasswordForm = ({
  email,
  setEmail,
  submitResetPasswordForm,
  themePreference,
  mobile,
}) => (
  <>
    <div>
      <H5 className="mb-2" text="Forgot password?" bold />
      <P2
        className="mb-5 text-secondary"
        text="Enter the email address associated with your account and
        we'll send you  a link to reset your password."
      />
      <form
        onSubmit={submitResetPasswordForm}
        className="d-flex flex-column w-100"
      >
        <label htmlFor="inputEmail">
          <P2 className="text-black" text="Email Address" bold />
        </label>
        <TextInput
          mode={themePreference}
          type="email"
          id="inputEmail"
          ariaDescribedBy="emailHelp"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary talent-button primary-default-button extra-big-size-button bold w-100 mt-5"
        >
          Reset Password
        </button>
      </form>
    </div>
    <Link
      text="Return to Login"
      href="/"
      bold
      className={cx("mt-5", mobile && "align-self-center")}
    />
  </>
);

const CheckEmail = ({ email, mobile }) => (
  <div className="d-flex flex-column align-items-center text-black">
    <Envelope color="currentColor" size={24} viewBox="0 0 24 24" />
    <H5 className="mt-4 mb-2" text="Check your email" bold />
    <P2
      className="mb-5 text-secondary"
      text={`We sent a password reset link to ${email}`}
    />
    <Link
      text="Return to Login"
      href="/"
      bold
      className={cx(
        "text-black",
        mobile && "position-absolute pb-4 fixed-bottom"
      )}
    />
  </div>
);

const ResetPassword = () => {
  const { mobile } = useWindowDimensionsHook();
  const { mode } = useTheme();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const submitResetPasswordForm = (e) => {
    e.preventDefault();
    post("/passwords", { email }).then(() => {
      setStep(2);
    });
  };

  return (
    <div
      className={cx(
        "d-flex flex-column align-self-center",
        !mobile && "justify-content-center p-0 registration-box",
        mobile && step === 1 && "p-4 justify-content-between w-100 h-100",
        mobile && step === 2 && "text-center justify-content-center w-100 h-100"
      )}
    >
      {step === 1 && (
        <ResetPasswordForm
          email={email}
          setEmail={setEmail}
          submitResetPasswordForm={submitResetPasswordForm}
          themePreference={mode()}
          mobile={mobile}
        />
      )}
      {step === 2 && <CheckEmail email={email} mobile={mobile} />}
    </div>
  );
};

export default (props, _railsContext) => {
  return () => (
    <RegistrationContainer {...props}>
      <ResetPassword {...props} />
    </RegistrationContainer>
  );
};
