import React, { useEffect, useState } from "react";
import TextInput from "../design_system/fields/textinput";
import RegistrationContainer from "../registration/RegistrationContainer";
import Tag from "../design_system/tag";
import Link from "../design_system/link";
import { useTheme } from "../../contexts/ThemeContext";
import { useWindowDimensionsHook } from "../../utils/window";
import { Check } from "../icons";
import { H5, P2, P3 } from "../design_system/typography";
import { put } from "../../utils/requests";
import cx from "classnames";

const ChangePasswordForm = ({
  password,
  setPassword,
  passwordConfirmation,
  setPasswordConfirmation,
  samePassword,
  submitChangePasswordForm,
  themePreference,
  invalidForm,
  tags,
  mobile,
}) => {
  return (
    <>
      <H5 className="mb-2" text="Set new password" bold />
      <P2
        className="mb-6 text-primary-03"
        text="Your password must satisfy the requests bellow"
      />
      <form
        onSubmit={submitChangePasswordForm}
        className="d-flex flex-column w-100"
      >
        <label htmlFor="inputPassword">
          <P2 text="New Password" bold />
        </label>
        <TextInput
          mode={themePreference}
          type="password"
          id="inputPassword"
          ariaDescribedBy="passwordHelp"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="d-flex flex-wrap">
          {tags.map((tag) => (
            <Tag className="mr-2 mt-2" key={tag}>
              <P3 mode={themePreference} text={tag} bold />
            </Tag>
          ))}
        </div>
        <label htmlFor="inputPasswordConfirmation" className="mt-4">
          <P2 text="Confirm Password" bold />
        </label>
        <TextInput
          mode={themePreference}
          type="password"
          id="inputPasswordConfirmation"
          ariaDescribedBy="passwordConfirmationHelp"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        {!samePassword && (
          <P3
            className="mt-2 text-danger"
            mode={themePreference}
            text="The password does not match"
          />
        )}
        <button
          type="submit"
          disabled={invalidForm}
          className="btn btn-primary talent-button primary-default-button bold extra-big-size-button w-100 mt-6"
        >
          Continue
        </button>
      </form>
      <Link
        text="Return to Login"
        href="/"
        bold
        className={cx("mt-6", mobile && "align-self-center mb-2")}
      />
    </>
  );
};

const PasswordResetConfirmed = () => (
  <div className="d-flex flex-column align-items-center text-black">
    <Check color="#1DB954" size={64} />
    <H5 className="mt-6" text="Password Reset" bold />
    <P2 className="mt-2" text="Your password has been succesfully reset." />
    <a
      className="btn btn-primary talent-button primary-default-button bold big-size-button w-100 mt-6"
      href="/"
    >
      Return to Login
    </a>
  </div>
);

const ChangePassword = ({ userId, token }) => {
  const { mobile } = useWindowDimensionsHook();
  const { mode } = useTheme();

  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [samePassword, setSamePassword] = useState(true);

  const tags = ["Number", "Upper Case", "Lower Case", "8 Characters"];
  const invalidForm =
    password.length < 8 ||
    passwordConfirmation.length < 8 ||
    !validPassword ||
    !samePassword;

  const submitChangePasswordForm = (e) => {
    e.preventDefault();
    put(`/users/${userId}/password`, {
      token,
      password_reset: { password },
    }).then(() => {
      setStep(2);
    });
  };

  useEffect(() => {
    if (password.length < 8) {
      setValidPassword(false);
    } else {
      setValidPassword(true);
    }
  }, [password, setValidPassword]);

  useEffect(() => {
    if (password.length > 7 && passwordConfirmation.length > 7) {
      if (password === passwordConfirmation) {
        setSamePassword(true);
      } else {
        setSamePassword(false);
      }
    } else {
      setSamePassword(true);
    }
  }, [password, passwordConfirmation]);

  return (
    <div
      className={cx(
        "d-flex flex-column align-self-center",
        !mobile && "justify-content-center p-0 registration-box",
        mobile && step === 1 && "p-4 justify-content-between w-100 h-100",
        mobile &&
          step === 2 &&
          "p-4 text-center justify-content-center w-100 h-100"
      )}
    >
      {step === 1 && (
        <ChangePasswordForm
          password={password}
          setPassword={setPassword}
          passwordConfirmation={passwordConfirmation}
          setPasswordConfirmation={setPasswordConfirmation}
          samePassword={samePassword}
          submitChangePasswordForm={submitChangePasswordForm}
          themePreference={mode()}
          invalidForm={invalidForm}
          tags={tags}
          mobile={mobile}
        />
      )}
      {step === 2 && <PasswordResetConfirmed />}
    </div>
  );
};

export default (props, _railsContext) => {
  return () => (
    <RegistrationContainer {...props}>
      <ChangePassword {...props} />
    </RegistrationContainer>
  );
};
