import React, { useState } from "react";
import { post } from "src/utils/requests";

const InviteUsers = ({ subscribers }) => {
  const [error, setError] = useState(false);
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const [email, setEmail] = useState(params.get("search") || "");
  const [name, setName] = useState("");
  const [talentInvite, setTalentInvite] = useState(false);
  const page = parseInt(params.get("page") || "1");

  const sendInvite = async (e) => {
    e.preventDefault();
    // ADD spinner
    const request = await post("/admin/invites", {
      invite: { email, name, talent_invite: talentInvite },
    });

    if (request) {
      window.location.href = `/admin/invites?success=${email}`;
    } else {
      setError(true);
    }
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

  setTimeout(
    () => window.history.replaceState({}, document.title, "/admin/invites"),
    5000
  );

  return (
    <form className="mt-3" onSubmit={sendInvite}>
      <div className="form-group is-required">
        <div className="d-flex flex-row w-100">
          <div className="d-flex flex-column mr-2">
            <label className="mr-2">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="...@emaildomain.com"
            />
            <small className="mt-2">
              Fill in the email to search on mailerlite (mailerlite will only
              find exact matches)
            </small>
          </div>
          <div className="d-flex flex-column ml-2">
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="name"
            />
            <small className="mt-2">
              Fill in the name if it's a new subscriber
            </small>
          </div>
          <div className="d-flex flex-column justify-content-center ml-2 form-check">
            <label className="mb-0">Talent Invite</label>
            <input
              onChange={() => setTalentInvite((prev) => !prev)}
              className="form-check-input mt-0"
              type="checkbox"
              checked={talentInvite}
            />
          </div>
        </div>
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
          {subscribers.length == 0 && (
            <button
              className="talent-button btn btn-light text-left"
              disabled={true}
            >
              No results found.
            </button>
          )}
          {subscribers.map((subscriber) => (
            <button
              key={`option_email_${subscriber.id}`}
              className="talent-button btn btn-light text-left"
              onClick={(e) => emailChosen(e, subscriber.email)}
            >
              {subscriber.name} - {subscriber.email}
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
