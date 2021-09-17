import React, { useState, useEffect } from "react";
import Uppy from "@uppy/core";
import { DragDrop } from "@uppy/react";
import AwsS3Multipart from "@uppy/aws-s3-multipart";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";

import { patch, getAuthToken } from "src/utils/requests";

import Button from "../../../button";

const uppy = new Uppy({
  meta: { type: "avatar" },
  restrictions: { maxNumberOfFiles: 1 },
  autoProceed: true,
});

uppy.use(AwsS3Multipart, {
  limit: 4,
  companionUrl: "/",
  companionHeaders: {
    "X-CSRF-Token": getAuthToken(),
  },
});

const About = ({
  close,
  talent,
  user,
  primary_tag,
  secondary_tags,
  profile_picture_url,
}) => {
  const [uploadingFileS3, setUploadingFileS3] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aboutInfo, setAboutInfo] = useState({
    username: user.username,
    display_name: user.display_name,
    pronouns: talent.profile.pronouns,
    location: talent.profile.location,
    primary_tag: primary_tag,
    secondary_tags: secondary_tags.join(", "),
    headline: talent.profile.headline,
    website: talent.profile.website,
    wallet_address: talent.profile.wallet_address,
    disable_messages: talent.disable_messages,
    public_profile: talent.public,
    video: talent.profile.video,
    uploadedFileData: null,
  });

  useEffect(() => {
    uppy.on("upload-success", (file, response) => {
      changeAttribute("uploadedFileData", {
        id: response.uploadURL.match(/\/cache\/([^\?]+)/)[1], // extract key without prefix
        storage: "cache",
        metadata: {
          size: file.size,
          filename: file.name,
          mime_type: file.type,
        },
      });
      setUploadingFileS3(false);
    });
    uppy.on("upload", () => {
      setUploadingFileS3(true);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const response = await patch(`/api/v1/talent/${talent.id}`, {
      talent: {
        username: aboutInfo["username"],
        display_name: aboutInfo["display_name"],
        profile_picture: aboutInfo["uploadedFileData"],
        public: aboutInfo["public_profile"],
        primary_tag: aboutInfo["primary_tag"],
        secondary_tags: aboutInfo["secondary_tags"],
        disable_messages: aboutInfo["disable_messages"],
        profile: {
          pronouns: aboutInfo["pronouns"],
          location: aboutInfo["location"],
          headline: aboutInfo["headline"],
          website: aboutInfo["website"],
          wallet_address: aboutInfo["wallet_address"],
          video: aboutInfo["video"],
        },
      },
    }).catch(() => setSaving(false));

    setSaving(false);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    close();
  };

  const changeAttribute = (attribute, value) => {
    setAboutInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  return (
    <div className="col-md-8 mx-auto d-flex flex-column my-3">
      <h4>About</h4>
      <form>
        <div className="form-group">
          <label className="mr-1">Profile picture</label>
          {uploadingFileS3 && (
            <p>
              <FontAwesomeIcon icon={faSpinner} spin /> Uploading...
            </p>
          )}
          {!uploadingFileS3 && aboutInfo["uploadedFileData"] !== null && (
            <p>Uploaded file. </p>
          )}
          {!uploadingFileS3 && aboutInfo["uploadedFileData"] === null && (
            <DragDrop
              uppy={uppy}
              locale={{
                strings: {
                  dropHereOr: "Drop here or %{browse}",
                  browse: "browse",
                },
              }}
            />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="form-control"
            placeholder="talentprotocol"
            value={aboutInfo["username"]}
            aria-describedby="username_help"
            onChange={(e) => changeAttribute("username", e.target.value)}
          />
          <small id="username_help" className="form-text text-muted">
            Only small letters allowed.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="display_name">Display Name</label>
          <input
            id="display_name"
            className="form-control"
            placeholder="The name that we will generally use"
            onChange={(e) => changeAttribute("display_name", e.target.value)}
            value={aboutInfo["display_name"]}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pronouns">Pronouns</label>
          <input
            id="pronouns"
            className="form-control"
            placeholder="he/him, she/her"
            value={aboutInfo["pronouns"]}
            onChange={(e) => changeAttribute("pronouns", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            className="form-control"
            placeholder="Nomad, Lisbon"
            value={aboutInfo["location"]}
            onChange={(e) => changeAttribute("location", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="primary_tag">Primary Tag</label>
          <input
            id="primary_tag"
            className="form-control"
            value={aboutInfo["primary_tag"]}
            aria-describedby="primary_tag_help"
            placeholder="The main thing that you do"
            onChange={(e) => changeAttribute("primary_tag", e.target.value)}
          />
          <small id="primary_tag_help" className="form-text text-muted">
            Sponsors can search for this keyword
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="secondary_tags">Secondary Tags</label>
          <input
            id="secondary_tags"
            className="form-control"
            value={aboutInfo["secondary_tags"]}
            placeholder="Other skills, roles, interests"
            onChange={(e) => changeAttribute("secondary_tags", e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="d-flex flex-row justify-content-between">
            <label htmlFor="headline">Headline</label>
            <label htmlFor="headline">
              <small className="text-muted">
                {aboutInfo["headline"]?.length || 0} of 70
              </small>
            </label>
          </div>
          <textarea
            rows="3"
            id="headline"
            className="form-control"
            value={aboutInfo["headline"]}
            placeholder="Short description of what you are about"
            onChange={(e) => changeAttribute("headline", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            className="form-control"
            value={aboutInfo["website"]}
            placeholder="The main url that represents you online"
            onChange={(e) => changeAttribute("website", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="video">Video</label>
          <input
            id="video"
            className="form-control"
            value={aboutInfo["video"]}
            aria-describedby="video_help"
            placeholder="A video that represents you"
            onChange={(e) => changeAttribute("video", e.target.value)}
          />
          <small id="video_help" className="form-text text-muted">
            Currently only youtube links are supported.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="wallet_address">Wallet Addres/ENS Name</label>
          <input
            id="wallet_address"
            className="form-control"
            placeholder="Your crypto address"
            value={aboutInfo["wallet_address"]}
            onChange={(e) => changeAttribute("wallet_address", e.target.value)}
          />
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            id="disable_messages"
            className="form-check-input"
            checked={aboutInfo["disable_messages"]}
            onChange={(e) =>
              changeAttribute("disable_messages", e.target.checked)
            }
          />
          <label className="form-check-label" htmlFor="disable_messages">
            Disable messages
          </label>
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            id="public_profile"
            className="form-check-input"
            checked={aboutInfo["public_profile"]}
            onChange={(e) =>
              changeAttribute("public_profile", e.target.checked)
            }
          />
          <label className="form-check-label" htmlFor="public_profile">
            Make profile public
          </label>
        </div>
        <div className="mb-2 d-flex flex-row align-items-end justify-content-between">
          <Button type="secondary" text="Cancel" onClick={handleCancel} />
          <button
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
        </div>
      </form>
    </div>
  );
};

export default About;
