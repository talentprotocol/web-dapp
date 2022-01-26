import React, { useEffect, useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { faSpinner, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { P2, H5 } from "../design_system/typography";
import TextInput from "../design_system/fields/textinput";
import { get } from "../../utils/requests";

const RegisterUsername = ({ themePreference, changeUsername, changeStep }) => {
  const [localUsername, setUsername] = useState("");
  const [requestingUsername, setRequestingUsername] = useState(false);
  const [usernameValidated, setUsernameValidated] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

  const invalidForm = !usernameValidated || usernameError;

  const editUsername = (e) => {
    if (e.target.value != "" && !/^[A-Za-z0-9]+$/.test(e.target.value)) {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
    setUsername(e.target.value);
  };

  const submitRegisterUsernameForm = (e) => {
    e.preventDefault();
    if (localUsername != "") {
      changeUsername(localUsername);
      changeStep(3);
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
    <>
      <H5 className="mb-6" text="Choose your username" bold />
      <form
        onSubmit={submitRegisterUsernameForm}
        className="d-flex flex-column w-100"
      >
        <div className="form-group position-relative">
          <label htmlFor="inputUsername" className="mt-2">
            <P2 className="text-black" text="Username" bold />
          </label>
          <TextInput
            mode={themePreference}
            type="text"
            id="inputUsername"
            value={localUsername}
            onChange={editUsername}
            error={usernameError}
          />
          <P2
            className="form-text text-primary-04 mt-1"
            text="This will be your Talent Protocol URL. We only accept lowercase letters and numbers."
          />
          {requestingUsername && (
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="position-absolute"
              style={{ top: 48, right: 10 }}
            />
          )}
          {usernameValidated && !usernameError && (
            <FontAwesomeIcon
              icon={faCheck}
              className="position-absolute text-success"
              style={{ top: 48, right: 10 }}
            />
          )}
          {(usernameExists || usernameError) && (
            <FontAwesomeIcon
              icon={faTimes}
              className="position-absolute text-danger"
              style={{ top: 48, right: 10 }}
            />
          )}
          {usernameExists && (
            <small id="usernameErrorHelp" className="form-text text-danger">
              We already have that username in the system.
            </small>
          )}
        </div>
        <button
          type="submit"
          disabled={invalidForm}
          className="btn btn-primary talent-button primary-default-button extra-big-size-button w-100 mt-6"
        >
          Continue
        </button>
      </form>
    </>
  );
};

export default RegisterUsername;
