import React, { useState } from "react";

const AccountCreation = ({ username, changeUsername, changeStep }) => {
  const [localUsername, setUsername] = useState(username);

  const submitAccountCreationForm = (e) => {
    e.preventDefault();
    if (localUsername != "") {
      changeUsername(localUsername);
      changeStep(4);
    }
  };

  const editUsername = (e) => {
    if (e.target.value == "" || /^[a-z0-9]+$/.test(e.target.value)) {
      setUsername(e.target.value);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ maxWidth: 400 }}>
      <h6 className="registration_step_subtitle">Step 3 of 4</h6>
      <h1>Username</h1>
      <p>
        Choose the username that you want to represent you, it can be your name
        or something else if you wish to remain anonymous in the platform.
      </p>
      <form onSubmit={submitAccountCreationForm} className="d-flex flex-column">
        <div className="form-group">
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
          <small id="usernameHelp" className="form-text text-muted">
            Only lowercased letters and numbers allowed.
          </small>
        </div>
        <div className="align-self-end">
          <button
            type="submit"
            disabled={!!username}
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
