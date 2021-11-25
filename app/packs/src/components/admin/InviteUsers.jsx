import React, { useState } from "react";
import { post } from "src/utils/requests";

const InviteUsers = ({ subscribers }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const page = parseInt(params.get("page") || "1");

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

  const search = (e) => {
    e.preventDefault();
    window.location.href = `/admin/invites?search=${email}`;
  };

  const nextPage = (e) => {
    e.preventDefault();
    if (email != "") {
      window.location.href = `/admin/invites?search=${email}&page=${page + 1}`;
    } else {
      window.location.href = `/admin/invites?page=${page + 1}`;
    }
  };

  const enableNextPage = () => subscribers.length == 100;

  const previousPage = (e) => {
    e.preventDefault();
    if (page && page > 1) {
      if (email != "") {
        window.location.href = `/admin/invites?search=${email}&page=${
          page - 1
        }`;
      } else {
        window.location.href = `/admin/invites?page=${page - 1}`;
      }
    }
  };

  const enablePrevPage = () => page && page > 1;

  return (
    <form className="mt-3" onSubmit={sendInvite}>
      <div className="form-group is-required">
        <label className="mr-2">
          Email <br />
          <small>Fill in the email to search on mailerlite.</small>
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          placeholder="...@emaildomain.com"
        />
        <div className="form-actions mt-3">
          <button
            className="btn btn-secondary talent-button mr-2"
            onClick={search}
          >
            SEARCH
          </button>

          <button type="submit" className="btn btn-primary talent-button">
            SEND INVITE
          </button>
        </div>
        <div className="d-flex flex-column my-3 border email-options">
          {subscribers.map((subscriber) => (
            <button
              key={`option_email_${subscriber.id}`}
              className="talent-button btn btn-light text-left"
              onClick={(e) => emailChosen(e, subscriber.email)}
            >
              {subscriber.email}
            </button>
          ))}
        </div>
        {error && <p className="text-danger">Unable to send email</p>}
      </div>

      <div className="form-actions mb-3">
        <button
          className="btn btn-secondary talent-button mr-2"
          onClick={previousPage}
          disabled={!enablePrevPage()}
        >
          {"<"} Previous
        </button>
        <button
          className="btn btn-primary talent-button"
          onClick={nextPage}
          disabled={!enableNextPage()}
        >
          Next {">"}
        </button>
      </div>
    </form>
  );
};

export default InviteUsers;
