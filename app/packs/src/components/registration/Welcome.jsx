import React, { useEffect, useState } from "react";
import { faSpinner, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { get } from "../../utils/requests";

const Welcome = ({ changeStep, changeEmail, email }) => {
  const [localEmail, setEmail] = useState(email);
  const [requestingEmail, setRequestingEmail] = useState(false);
  const [emailValidated, setEmailValidated] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const validEmail = () => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(localEmail).toLowerCase());
  };

  const submitWelcomeForm = (e) => {
    e.preventDefault();
    if (localEmail != "" && validEmail()) {
      changeEmail(localEmail);
      changeStep(3);
    }
  };

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

  return (
    <div className="d-flex flex-column" style={{ maxWidth: 400 }}>
      <h6 className="registration_step_subtitle">Step 1 of 3</h6>
      <h1>Welcome!</h1>
      <p>
        We're currently in alpha. Enter your email to register your account.
      </p>
      <p>
        <small>
          If you already have an account <a href="/sign_in">sign in</a>.
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
        </div>
        <div className="align-self-end">
          <button
            type="submit"
            disabled={!validEmail() || !emailValidated}
            className="ml-2 btn btn-primary talent-button"
          >
            Next {">"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Welcome;
