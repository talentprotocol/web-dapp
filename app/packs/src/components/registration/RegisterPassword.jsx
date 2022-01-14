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
    const { valid } = passwordMatchesRequirements();
    setValidPassword(valid);
  }, [localPassword, setValidPassword]);

  const passwordMatchesRequirements = () => {
    const lengthRegex = new RegExp("^.{8,}$");
    const lowercaseRegex = new RegExp("(?=.*[a-z])");
    const uppercaseRegex = new RegExp("(?=.*[A-Z])");
    const digitRegex = new RegExp("(?=.*[0-9])");
    const errors = {};
    let valid = true;

    // the keys must match the tag names
    if (!lengthRegex.test(localPassword)) {
      errors["8 Characters"] = true;
      valid = false;
    } else {
      errors["8 Characters"] = false;
    }

    if (!lowercaseRegex.test(localPassword)) {
      errors["Lower Case"] = true;
      valid = false;
    } else {
      errors["Lower Case"] = false;
    }

    if (!uppercaseRegex.test(localPassword)) {
      errors["Upper Case"] = true;
      valid = false;
    } else {
      errors["Upper Case"] = false;
    }

    if (!digitRegex.test(localPassword)) {
      errors["Number"] = true;
      valid = false;
    } else {
      errors["Number"] = false;
    }

    return { errors, valid };
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

  const { errors } = passwordMatchesRequirements();

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
              <Tag
                mode={themePreference}
                className={`mr-2 mt-2${errors[tag] ? "" : " bg-success"}`}
                key={tag}
              >
                <P3
                  mode={themePreference}
                  text={tag}
                  bold
                  className={errors[tag] ? "" : "text-white"}
                />
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
