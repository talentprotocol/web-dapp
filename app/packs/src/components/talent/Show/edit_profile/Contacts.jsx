import React, { useState } from "react";

import { patch } from "src/utils/requests";

import Button from "../../../button";

const Contacts = () => {
  const [contactsInfo, setContactsInfo] = useState({
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    email: "",
    telegram: "",
    discord: "",
  });

  const changeAttribute = (attribute, value) => {
    setContactsInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  return (
    <div className="col-md-8 mx-auto d-flex flex-column my-3">
      <h4>About</h4>
      <form>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="form-control"
            value={contactsInfo["email"]}
            placeholder="you@example.com"
            onChange={(e) => changeAttribute("email", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="linkedin">Linkedin</label>
          <input
            id="linkedin"
            className="form-control"
            value={contactsInfo["linkedin"]}
            placeholder="https://.."
            onChange={(e) => changeAttribute("linkedin", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="twitter">Twitter</label>
          <input
            id="twitter"
            className="form-control"
            value={contactsInfo["twitter"]}
            placeholder="https://.."
            onChange={(e) => changeAttribute("twitter", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="telegram">Telegram</label>
          <input
            id="telegram"
            className="form-control"
            value={contactsInfo["telegram"]}
            placeholder="https://.."
            onChange={(e) => changeAttribute("telegram", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="discord">Discord</label>
          <input
            id="discord"
            className="form-control"
            value={contactsInfo["discord"]}
            placeholder="https://.."
            onChange={(e) => changeAttribute("discord", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="github">Github</label>
          <input
            id="github"
            className="form-control"
            value={contactsInfo["github"]}
            placeholder="https://.."
            onChange={(e) => changeAttribute("github", e.target.value)}
          />
        </div>
        <div className="mb-2 d-flex flex-row align-items-end justify-content-between">
          <Button type="secondary" text="Cancel" onClick={() => null} />
          <Button type="primary" text="Save" onClick={() => null} />
        </div>
      </form>
    </div>
  );
};

export default Contacts;
