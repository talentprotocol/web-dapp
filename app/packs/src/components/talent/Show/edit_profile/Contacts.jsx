import React, { useState } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { patch } from "src/utils/requests";

import Button from "../../../button";

const Contacts = ({ close, talent, user, updateSharedState }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [contactsInfo, setContactsInfo] = useState({
    github: talent.profile.github || "",
    linkedin: talent.profile.linkedin || "",
    twitter: talent.profile.twitter || "",
    instagram: talent.profile.instagram || "",
    email: user.email || "",
    telegram: talent.profile.telegram || "",
    discord: talent.profile.discord || "",
  });

  const changeAttribute = (attribute, value) => {
    setContactsInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const response = await patch(`/api/v1/talent/${talent.id}`, {
      talent: {
        profile: {
          github: contactsInfo["github"],
          linkedin: contactsInfo["linkedin"],
          twitter: contactsInfo["twitter"],
          instagram: contactsInfo["instagram"],
          email: contactsInfo["email"],
          telegram: contactsInfo["telegram"],
          discord: contactsInfo["discord"],
        },
      },
    }).catch(() => {
      setError(true);
      setSaving(false);
    });

    if (response) {
      if (response.error) {
        setError(true);
      } else {
        updateSharedState((prevState) => ({
          ...prevState,
          talent: {
            ...prevState.talent,
            profile: {
              ...prevState.talent.profile,
              github: contactsInfo["github"],
              linkedin: contactsInfo["linkedin"],
              twitter: contactsInfo["twitter"],
              instagram: contactsInfo["instagram"],
              email: contactsInfo["email"],
              telegram: contactsInfo["telegram"],
              discord: contactsInfo["discord"],
            },
          },
        }));
      }
    }

    setSaving(false);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    close();
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
            placeholder="@.."
            onChange={(e) => changeAttribute("telegram", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="discord">Discord</label>
          <input
            id="discord"
            className="form-control"
            value={contactsInfo["discord"]}
            placeholder="..#.."
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
        {error && (
          <>
            <p className="text-danger">
              We had some trouble updating your contacts. Reach out to us if
              this persists.
            </p>
          </>
        )}
        <p className="my-3">* Field is required.</p>
        <div className="mb-2 d-flex flex-row-reverse align-items-end justify-content-between">
          <button
            type="submit"
            disabled={saving}
            onClick={handleSave}
            className="btn btn-primary talent-button"
          >
            {saving ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Saving
              </>
            ) : (
              "Save"
            )}
          </button>
          <Button type="secondary" text="Cancel" onClick={handleCancel} />
        </div>
      </form>
    </div>
  );
};

export default Contacts;
