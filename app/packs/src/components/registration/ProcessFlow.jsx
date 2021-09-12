import React, { useEffect, useState } from "react";

import { faSpinner, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { post } from "../../utils/requests";

const ProcessingUser = () => (
  <div className="d-flex flex-row text-muted align-items-center">
    <FontAwesomeIcon icon={faSpinner} spin />
    <p className="ml-2 mb-0">Setting up your user profile...</p>
  </div>
);

const UserCreated = () => (
  <>
    <div className="d-flex flex-row text-success align-items-center">
      <FontAwesomeIcon icon={faCheck} />
      <p className="ml-2 mb-0">User profile created.</p>
    </div>
    <a
      role="button"
      href={"/"}
      className="ml-2 btn btn-primary talent-button"
    >
      Sign in
    </a>
  </>
);

const UserFailed = ({ error }) => (
  <div className="d-flex flex-column text-danger align-items-center">
    <div className="d-flex flex-row align-items-center">
      <FontAwesomeIcon icon={faTimes} />
      <p className="ml-2 mb-0">We had an issue creating your user.</p>
    </div>
    <p className="ml-2 mb-0">{error}</p>
  </div>
);

const ProcessFlow = ({ email, username, password }) => {
  const [userCreated, setUserCreated] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setRequesting(true);
    post("/users.json", { email, username, password })
      .then((response) => {
        if (response.error) {
          setError(response.error);
          setRequesting(false);
        } else {
          setUserCreated(true);
          setRequesting(false);
        }
      })
      .catch(() => {
        setError("Please reach out to us if this persists.");
        setRequesting(false);
      });
  }, [email]);

  return (
    <div className="d-flex flex-column" style={{ maxWidth: 400 }}>
      <h1>Setting up your account</h1>
      {error != "" && <UserFailed error={error} />}
      {!userCreated && requesting && <ProcessingUser />}
      {userCreated && <UserCreated />}
    </div>
  );
};

export default ProcessFlow;
