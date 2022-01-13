import React, { useEffect, useState } from "react";
import { H5, P2, P3 } from "../design_system/typography";
import Tag from "../design_system/tag";
import TextInput from "../design_system/fields/textinput";

const RegisterPassword = ({ themePreference, changePassword, changeStep }) => {
  const [localPassword, setLocalPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [samePassword, setSamePassword] = useState(true);

  const tags = ["Number", "Upper Case", "Lower Case", "8 Characters"];
  const invalidForm =
    localPassword.length < 8 ||
    passwordConfirmation.length < 8 ||
    !validPassword ||
    !samePassword;

  const submitRegisterPasswordForm = (e) => {
    e.preventDefault();
    if (localPassword != "") {
      changePassword(localPassword);
      changeStep(4);
    }
  };

  useEffect(() => {
    if (localPassword.length < 8) {
      setValidPassword(false);
    } else {
      setValidPassword(true);
    }
  }, [localPassword, setValidPassword]);

  useEffect(() => {
    if (localPassword.length > 7 && passwordConfirmation.length > 7) {
      if (localPassword === passwordConfirmation) {
        setSamePassword(true);
      } else {
        setSamePassword(false);
      }
    } else {
      setSamePassword(true);
    }
  }, [localPassword, passwordConfirmation]);

  return (
    <>
      <H5 text="Choose your password" bold />
      <form
        onSubmit={submitRegisterPasswordForm}
        className="d-flex flex-column w-100"
      >
        <div className="form-group position-relative">
          <label htmlFor="inputPassword">
            <P2 text="Choose Password" bold />
          </label>
          <TextInput
            mode={themePreference}
            type="password"
            id="inputPassword"
            ariaDescribedBy="passwordHelp"
            value={localPassword}
            onChange={(e) => setLocalPassword(e.target.value)}
          />
          <div className="d-flex flex-wrap">
            {tags.map((tag) => (
              <Tag mode={themePreference} className="mr-2 mt-2" key={tag}>
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
              className="mt-2"
              mode={themePreference}
              text="The password does not match"
            />
          )}
        </div>
        <button
          type="submit"
          disabled={invalidForm}
          className="btn btn-primary talent-button extra-big-size-button w-100 mt-5"
        >
          Create account
        </button>
      </form>
    </>
  );
};

export default RegisterPassword;
