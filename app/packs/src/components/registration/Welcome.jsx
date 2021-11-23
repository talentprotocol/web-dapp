import React, { useEffect, useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { faSpinner, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { get } from "../../utils/requests";
import { TERMS_HREF, PRIVACY_HREF } from "../../utils/constants";

const Welcome = ({
  changeStep,
  changeEmail,
  changePassword,
  email,
  username,
  changeUsername,
  changeCode,
}) => {
  const [localEmail, setEmail] = useState(email);
  const [localPassword, setLocalPassword] = useState("");
  const [requestingEmail, setRequestingEmail] = useState(false);
  const [emailValidated, setEmailValidated] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [validPassword, setValidPassword] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [localUsername, setUsername] = useState(username);
  const [requestingUsername, setRequestingUsername] = useState(false);
  const [usernameValidated, setUsernameValidated] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const url = new URL(document.location);
  const [localCode, setCode] = useState(url.searchParams.get("code") || "");

  const editUsername = (e) => {
    if (e.target.value == "" || /^[A-Za-z0-9]+$/.test(e.target.value)) {
      setUsername(e.target.value.toLowerCase());
    }
  };

  const verify = useCallback(
    debounce((name, setname, setvalid, setexists) => {
      setRequestingUsername(true);
      setvalid(false);

      get(`/users?username=${name}`)
        .then((response) => {
          if (response.error) {
            setname(false);
            setexists(false);
            setvalid(true);
          } else {
            setname(false);
            setvalid(false);
            setexists(true);
          }
        })
        .catch(() => {
          setname(false);
          setexists(false);
          setvalid(true);
        });
    }, 200),
    []
  );

  const validEmail = () => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(localEmail).toLowerCase());
  };

  const invalidForm =
    !validEmail() ||
    !emailValidated ||
    localPassword.length < 8 ||
    !usernameValidated ||
    localCode.length < 1 ||
    !acceptedTerms;

  const submitWelcomeForm = (e) => {
    e.preventDefault();
    if (
      localEmail != "" &&
      validEmail() &&
      localPassword.length > 7 &&
      localUsername != ""
    ) {
      changeEmail(localEmail);
      changePassword(localPassword);
      changeUsername(localUsername);
      changeCode(localCode);
      changeStep(2);
    }
  };

  useEffect(() => {
    if (localUsername == "") {
      setUsernameValidated(false);
      return;
    }

    verify(
      localUsername,
      setRequestingUsername,
      setUsernameValidated,
      setUsernameExists
    );
  }, [localUsername]);

  useEffect(() => {
    if (!validEmail()) {
      setEmailValidated(false);
      return;
    }

    setRequestingEmail(true);

    get(`/users?email=${localEmail}`)
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

  useEffect(() => {
    if (localPassword.length > 0 && localPassword.length < 8) {
      setValidPassword(false);
    } else {
      setValidPassword(true);
    }
  }, [localPassword, setValidPassword]);

  return (
    <div className="d-flex flex-column" style={{ maxWidth: 400 }}>
      <h1>Welcome!</h1>
      <p>
        We're currently in private beta. Enter the information below to register
        your account.
      </p>
      <p>
        <small>
          If you already have an account <a href="/">sign in</a>.
        </small>
      </p>
      <form onSubmit={submitWelcomeForm} className="d-flex flex-column">
        <div className="form-group position-relative">
          <label htmlFor="inputEmail">
            <small>Email</small>
          </label>
          <input
            type="email"
            className="form-control"
            id="inputEmail"
            aria-describedby="emailHelp"
            value={localEmail}
            onChange={(e) => setEmail(e.target.value)}
          />
          {requestingEmail && (
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="position-absolute"
              style={{ top: 43, right: 10 }}
            />
          )}
          {emailValidated && (
            <FontAwesomeIcon
              icon={faCheck}
              className="position-absolute text-success"
              style={{ top: 43, right: 10 }}
            />
          )}
          {emailExists && (
            <FontAwesomeIcon
              icon={faTimes}
              className="position-absolute text-danger"
              style={{ top: 43, right: 10 }}
            />
          )}
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
          {emailExists && (
            <small id="emailErrorHelp" className="form-text text-danger">
              We already have that email in the system.
            </small>
          )}
          <label htmlFor="inputPassword" className="mt-2">
            <small>Password</small>
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword"
            aria-describedby="passwordHelp"
            value={localPassword}
            onChange={(e) => setLocalPassword(e.target.value)}
          />
          {localPassword.length > 7 && (
            <FontAwesomeIcon
              icon={faCheck}
              className="position-absolute text-success"
              style={{ top: 144, right: 10 }}
            />
          )}
          {!validPassword && (
            <FontAwesomeIcon
              icon={faTimes}
              className="position-absolute text-danger"
              style={{ top: 144, right: 10 }}
            />
          )}
          {!validPassword && (
            <small id="passwordErrorHelp" className="form-text text-danger">
              Password needs to have a minimum of 8 characters
            </small>
          )}
          <label htmlFor="inputUsername" className="mt-2">
            <small>Username</small>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputUsername"
            value={localUsername}
            onChange={editUsername}
          />
          {requestingUsername && (
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="position-absolute"
              style={{ top: 222, right: 10 }}
            />
          )}
          {usernameValidated && (
            <FontAwesomeIcon
              icon={faCheck}
              className="position-absolute text-success"
              style={{ top: 222, right: 10 }}
            />
          )}
          {usernameExists && (
            <FontAwesomeIcon
              icon={faTimes}
              className="position-absolute text-danger"
              style={{ top: 222, right: 10 }}
            />
          )}
          <small id="usernameHelp" className="form-text text-muted">
            Only lowercased letters and numbers allowed.
          </small>
          {usernameExists && (
            <small id="usernameErrorHelp" className="form-text text-danger">
              We already have that username in the system.
            </small>
          )}
          <label htmlFor="inputCode" className="mt-2">
            <small>Code</small>
          </label>
          <input
            className="form-control"
            id="inputCode"
            aria-describedby="codeHelp"
            value={localCode}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="form-group form-check mt-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="termsAndConditions"
              defaultChecked={acceptedTerms}
              onChange={() => setAcceptedTerms((prev) => !prev)}
            />
            <label className="form-check-label" htmlFor="termsAndConditions">
              <small>
                I have read and agree to the{" "}
                <a target="_blank" href={TERMS_HREF}>
                  Talent Protocol Terms & Conditions
                </a>{" "}
                and the{" "}
                <a target="_blank" href={PRIVACY_HREF}>
                  Talent Protocol Privacy Policy
                </a>
                .
              </small>
            </label>
          </div>
        </div>
        <div className="align-self-end">
          <button
            type="submit"
            disabled={invalidForm}
            className="ml-2 btn btn-primary talent-button"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Welcome;
