import React, { useState } from "react";
import { post } from "src/utils/requests";

const InviteUsers = ({ subscribers }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  const filteredEmails = subscribers.filter((item) => item.includes(email));

  const sendInvite = async (e) => {
    e.preventDefault();

    const request = await post("/admin/invites", {
      invite: { email },
    });

    if (request) {
      window.location.href = `/admin/invites?success=${email}`;
    } else {
      setError(true);
    }
  };

  const cancel = (e) => {
    e.preventDefault();

    window.location.href = "/admin/invites";
  };

  const emailChosen = (e, emailChosen) => {
    e.preventDefault();

    setEmail(emailChosen);
  };

  return (
    <form className="mt-3" onSubmit={sendInvite}>
      <div className="form-group is-required">
        <label className="mr-2">
          Email <br />
          <small>
            Fill in the email or pick one from the list. The list will filter as
            you type.
          </small>
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          placeholder="...@emaildomain.com"
        />
        <div className="d-flex flex-column my-3 border email-options">
          {filteredEmails.map((emailItem) => (
            <button
              key={`option_email_${emailItem}`}
              className="talent-button btn btn-light"
              onClick={(e) => emailChosen(e, emailItem)}
            >
              {emailItem}
            </button>
          ))}
        </div>
        {error && <p className="text-danger">Unable to send email</p>}
      </div>

      <div className="form-actions">
        <button
          className="btn btn-secondary talent-button mr-2"
          onClick={cancel}
        >
          CANCEL
        </button>
        <button type="submit" className="btn btn-primary talent-button">
          SEND INVITE
        </button>
      </div>
    </form>
  );
};

export default InviteUsers;
