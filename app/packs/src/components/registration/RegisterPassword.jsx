import React, { useEffect, useState } from "react";
import { H5, P2, P3 } from "src/components/design_system/typography";
import Tag from "src/components/design_system/tag";
import TextInput from "src/components/design_system/fields/textinput";

import { passwordMatchesRequirements } from "src/utils/passwordRequirements";

const RegisterPassword = ({ themePreference, changePassword, changeStep }) => {
  const [localPassword, setLocalPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [samePassword, setSamePassword] = useState(true);
  const {
    valid: validPassword,
    errors,
    tags,
  } = passwordMatchesRequirements(localPassword);
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
            <P2 className="text-black" text="Choose Password" bold />
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
              <Tag
                className={`mr-2 mt-2${errors[tag] ? "" : " bg-success"}`}
                key={tag}
              >
                <P3
                  mode={themePreference}
                  text={tag}
                  bold
                  className={errors[tag] ? "" : "permanent-text-white"}
                />
              </Tag>
            ))}
          </div>
          <label htmlFor="inputPasswordConfirmation" className="mt-4">
            <P2 className="text-black" text="Confirm Password" bold />
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
        </div>
        <button
          type="submit"
          disabled={invalidForm}
          className="btn btn-primary talent-button primary-default-button extra-big-size-button w-100 mt-6"
        >
          Create account
        </button>
      </form>
    </>
  );
};

export default RegisterPassword;
