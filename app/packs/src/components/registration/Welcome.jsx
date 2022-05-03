import React, { useEffect, useState } from "react";
import { faSpinner, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReCAPTCHA from "react-google-recaptcha";
import { H5, P2 } from "../design_system/typography";
import TextInput from "../design_system/fields/textinput";
import Checkbox from "../design_system/checkbox";
import Link from "../design_system/link";

import { get } from "src/utils/requests";
import { TERMS_HREF, PRIVACY_HREF, USER_GUIDE } from "src/utils/constants";
import { useWindowDimensionsHook } from "src/utils/window";
import { emailRegex } from "src/utils/regexes";
import cx from "classnames";

const Welcome = ({
  themePreference,
  changeStep,
  changeEmail,
  email,
  changeCode,
  setCaptcha,
  captchaKey,
}) => {
  const { width } = useWindowDimensionsHook();
  const mobile = width < 992;

  const [localEmail, setEmail] = useState(email);
  const [localCaptcha, setLocalCaptcha] = useState(null);
  const [requestingEmail, setRequestingEmail] = useState(false);
  const [emailValidated, setEmailValidated] = useState(null);
  const [emailExists, setEmailExists] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const url = new URL(document.location);
  const [localCode, setCode] = useState(url.searchParams.get("code") || "");

  const validEmail = () => {
    return emailRegex.test(String(localEmail).toLowerCase());
  };

  const invalidForm =
    !validEmail() ||
    !emailValidated ||
    localCode.length < 1 ||
    !acceptedTerms ||
    !localCaptcha;

  const submitWelcomeForm = (e) => {
    e.preventDefault();
    if (
      localEmail != "" &&
      validEmail() &&
      localCode.length > 0 &&
      localCaptcha
    ) {
      changeEmail(localEmail);
      changeCode(localCode);
      setCaptcha(localCaptcha);
      changeStep(2);
    }
  };

  useEffect(() => {
    if (localEmail.length === 0) {
      return;
    }

    if (!validEmail()) {
      setEmailValidated(false);
      return;
    }

    setRequestingEmail(true);
    const searchParams = new URLSearchParams({ email: localEmail });

    get(`/users?${searchParams}`)
      .then((response) => {
        if (response.error) {
          setRequestingEmail(false);
          setEmailExists(false);
          setEmailValidated(true);
        } else {
          setRequestingEmail(false);
          setEmailValidated(false);
          setEmailExists(true);
        }
      })
      .catch(() => {
        setRequestingEmail(false);
        setEmailExists(false);
        setEmailValidated(true);
      });
  }, [localEmail]);

  const recaptchaSubmition = (value) => {
    setLocalCaptcha(value);
  };

  return (
    <>
      <div className="mb-6">
        <H5 text="Welcome to Talent Protocol!" bold />
        <P2
          className="text-primary-03"
          text="We're still still invite-only and in early beta, but already
            live on Celo mainnet. Enter the information requestes below to create
            your supporter account."
        />
      </div>
      <form onSubmit={submitWelcomeForm} className="d-flex flex-column w-100">
        <div className="form-group position-relative">
          <label htmlFor="inputEmail">
            <P2 className="text-black" text="Email Address" bold />
          </label>
          <TextInput
            mode={themePreference}
            type="email"
            id="inputEmail"
            ariaDescribedBy="emailHelp"
            value={localEmail}
            onChange={(e) => setEmail(e.target.value)}
          />
          {requestingEmail && (
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="position-absolute"
              style={{ top: 42, right: 10 }}
            />
          )}
          {emailValidated && (
            <FontAwesomeIcon
              icon={faCheck}
              className="position-absolute text-success"
              style={{ top: 42, right: 10 }}
            />
          )}
          {emailValidated === false && (
            <FontAwesomeIcon
              icon={faTimes}
              className="position-absolute text-danger"
              style={{ top: 42, right: 10 }}
            />
          )}
          {emailValidated === false && (
            <small id="emailErrorHelp" className="form-text text-danger">
              This is not a valid email. You cannot use aliases
            </small>
          )}
          {emailExists && (
            <FontAwesomeIcon
              icon={faTimes}
              className="position-absolute text-danger"
              style={{ top: 42, right: 10 }}
            />
          )}
          {emailExists && (
            <small id="emailErrorHelp" className="form-text text-danger">
              We already have that email in the system.
            </small>
          )}
          <label htmlFor="inputCode" className="mt-4">
            <P2 className="text-black" text="Invite Code" bold />
          </label>
          <TextInput
            mode={themePreference}
            id="inputCode"
            ariaDescribedBy="codeHelp"
            value={localCode}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="d-flex flex-row w-100 mt-4">
            <ReCAPTCHA sitekey={captchaKey} onChange={recaptchaSubmition} />
          </div>
          <div className="form-group mt-4">
            <Checkbox
              className="form-check-input"
              htmlFor="termsAndConditions"
              id="termsAndConditions"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms((prev) => !prev)}
            >
              <div className="d-flex flex-wrap">
                <P2 className="mr-1" text="I have read and agree to the" />
                <Link
                  className="mr-1"
                  text="Talent Protocol Terms & Conditions"
                  href={TERMS_HREF}
                  target="_blank"
                />
                <P2 className="mr-1" text="and the" />
                <Link
                  text="Talent Protocol Privacy Policy"
                  href={PRIVACY_HREF}
                  target="_blank"
                />
                <P2 text="." />
              </div>
            </Checkbox>
          </div>
        </div>
        <button
          type="submit"
          disabled={invalidForm}
          className="btn btn-primary talent-button primary-default-button extra-big-size-button w-100"
        >
          Continue
        </button>
      </form>
      <div
        className={cx("d-flex w-100 mt-6", mobile && "justify-content-center")}
      >
        <P2 className="text-black mr-1" text="Already have an account?" />
        <Link text="Login" href="/" bold />
      </div>
      <div
        className={cx(
          "d-flex w-100 mt-2",
          mobile && "justify-content-center pb-4"
        )}
      >
        <P2 className="text-black mr-1" text="Want more info?" />
        <Link
          bold
          href={USER_GUIDE}
          target="_blank"
          text="Check our user guide"
        />
      </div>
    </>
  );
};

export default Welcome;
