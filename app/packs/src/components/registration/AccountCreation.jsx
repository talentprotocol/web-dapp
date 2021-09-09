import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { faSpinner, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { get } from "../../utils/requests";

const AccountCreation = ({ username, changeUsername, changeStep }) => {
  const [localUsername, setUsername] = useState(username);
  const [requestingUsername, setRequestingUsername] = useState(false);
  const [usernameValidated, setUsernameValidated] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);

  const submitAccountCreationForm = (e) => {
    e.preventDefault();
    if (localUsername != "") {
      changeUsername(localUsername);
      changeStep(4);
    }
  };

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

  return (
    <div className="d-flex flex-column" style={{ maxWidth: 400 }}>
      <h6 className="registration_step_subtitle">Step 2 of 3</h6>
      <h1>Username</h1>
      <p>
        Choose a unique username (you can edit this later). It can be your real
        name or an alias if you wish to remain anonymous for now.
      </p>
      <form onSubmit={submitAccountCreationForm} className="d-flex flex-column">
        <div className="form-group position-relative">
          <label htmlFor="inputUsername">
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
              style={{ top: 43, right: 10 }}
            />
          )}
          {usernameValidated && (
            <FontAwesomeIcon
              icon={faCheck}
              className="position-absolute text-success"
              style={{ top: 43, right: 10 }}
            />
          )}
          {usernameExists && (
            <FontAwesomeIcon
              icon={faTimes}
              className="position-absolute text-danger"
              style={{ top: 43, right: 10 }}
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
        </div>
        <div className="align-self-end">
          <button
            type="submit"
            disabled={localUsername == "" || !usernameValidated}
            className="ml-2 btn btn-primary talent-button"
          >
            Next {">"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountCreation;
