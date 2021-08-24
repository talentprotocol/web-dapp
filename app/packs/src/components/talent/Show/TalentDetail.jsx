import React, { useState, useEffect, useRef } from "react";
import { faEdit, faEyeSlash, faEye } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import Uppy from "@uppy/core";
import { DragDrop } from "@uppy/react";
import AwsS3Multipart from "@uppy/aws-s3-multipart";

import { patch, getAuthToken } from "src/utils/requests";
import LinkedInIcon from "images/linkedin.png";

import Button from "../../button";
import TalentProfilePicture from "../TalentProfilePicture";
import TalentTags from "../TalentTags";

import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";

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

const TalentDetail = ({
  talentId,
  profilePictureUrl,
  username,
  ticker,
  tags,
  linkedinUrl,
  allowEdit,
  tokenDeployed,
  publicProfile,
}) => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [editLinkedinUrl, setEditLinkedinUrl] = useState(linkedinUrl || "");
  const [editTicker, setEditTicker] = useState(ticker || "");
  const [editUsername, setEditUsername] = useState(username || "");
  const [editTagsText, setEditTagsText] = useState(tags.join(", "));
  const [editProfilePictureUrl, setEditProfilePictureUrl] = useState(null);
  const [editPublicProfile, setEditPublicProfile] = useState(publicProfile);
  const [uploadedFileData, setUploadedFileData] = useState(null);
  const [uploadingFileS3, setUploadingFileS3] = useState(false);

  const [showLinkedinUrl, setShowLinkedinUrl] = useState(linkedinUrl || "");
  const [showTicker, setShowTicker] = useState(ticker || "");
  const [showUsername, setShowUsername] = useState(username || "");
  const [showTags, setShowTags] = useState(tags);
  const [showProfilePictureUrl, setShowProfilePictureUrl] =
    useState(profilePictureUrl);

  const publicIcon = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    uppy.on("upload-success", (file, response) => {
      setEditProfilePictureUrl(response.uploadURL);
      setUploadedFileData({
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

  const handleShow = () => setShow(true);
  const handleDismiss = () => {
    setEditPublicProfile(publicProfile);
    setShow(false);
  };

  const handleSave = async () => {
    const response = await patch(`/talent/${talentId}`, {
      talent: {
        tags: editTagsText,
        linkedin_url: editLinkedinUrl,
        profile_picture: uploadedFileData,
        public: editPublicProfile,
      },
      user: { username: editUsername },
      token: { ticker: editTicker },
    });
    if (response.error) {
      setError(true);
    } else {
      setShowLinkedinUrl(editLinkedinUrl);
      setShowTicker(editTicker);
      setShowUsername(editUsername);
      setShowTags(editTagsText.split(",").map((t) => t.trim()));
      if (editProfilePictureUrl != null) {
        setShowProfilePictureUrl(editProfilePictureUrl);
      }
      setShow(false);
    }
  };

  return (
    <div className="mb-3 mb-md-5 d-flex flex-column flex-md-row align-items-center">
      <TalentProfilePicture src={showProfilePictureUrl} height={96} />
      <div className="d-flex flex-column ml-2">
        <h1 className="h2">
          <small>
            {showUsername} <span className="text-muted">({showTicker})</span>
          </small>
        </h1>
        <TalentTags tags={showTags} />
      </div>
      <div className="ml-md-auto d-flex flex-row-reverse flex-md-column justify-content-between align-items-end mt-2 mt-md-0">
        {allowEdit && (
          <div ref={publicIcon} className="mx-auto">
            <FontAwesomeIcon
              icon={editPublicProfile ? faEye : faEyeSlash}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            <Overlay
              target={publicIcon.current}
              show={showTooltip}
              placement="bottom"
            >
              {(props) => (
                <Tooltip id="public-profile-tooltip" {...props}>
                  {editPublicProfile
                    ? "Your profile is public."
                    : "Your profile is currently in draft and is not being listed."}
                </Tooltip>
              )}
            </Overlay>
          </div>
        )}
        {allowEdit && (
          <button
            onClick={handleShow}
            className="btn btn-outline-secondary talent-button border-0"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
        )}
        <Modal show={show} onHide={handleDismiss}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && (
              <p className="text-danger">
                Unable to update your profile. Check if you added invalid
                characters.
              </p>
            )}
            {!tokenDeployed && (
              <div className="form-group">
                <label forhtml="detail-ticker">Ticker</label>
                <input
                  type="text"
                  name="ticker"
                  id="detail-ticker"
                  value={editTicker}
                  onChange={(e) => setEditTicker(e.target.value)}
                  placeholder="Change your ticker"
                  className="form-control mb-2 rounded-sm"
                />
              </div>
            )}
            <div className="form-group">
              <label forhtml="detail-username">Username</label>
              <input
                type="text"
                name="username"
                id="detail-username"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Change your usename"
                className="form-control mb-2 rounded-sm"
              />
            </div>
            <div className="form-group">
              <input
                type="checkbox"
                className="form-check-input ml-1"
                id="public-profile"
                checked={editPublicProfile}
                onChange={() => setEditPublicProfile(!editPublicProfile)}
              />
              <label className="form-check-label ml-4" htmlFor="public-profile">
                Public profile <small>(Only public profiles are listed)</small>
              </label>
            </div>
            <div className="form-group">
              <label forhtml="detail-linkedin">Linkedin</label>
              <input
                type="text"
                name="linkedin"
                id="detail-linkedin"
                value={editLinkedinUrl}
                onChange={(e) => setEditLinkedinUrl(e.target.value)}
                placeholder="Change your linkedin url"
                className="form-control mb-2 rounded-sm"
              />
            </div>
            <div className="form-group">
              <label className="mr-1">Profile picture</label>
              {uploadingFileS3 && <p>Uploading...</p>}
              {!uploadingFileS3 && uploadedFileData !== null && (
                <p>Uploaded file.</p>
              )}
              {!uploadingFileS3 && uploadedFileData === null && (
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
              <label forhtml="detail-tags">Tags</label>
              <input
                type="text"
                name="tags"
                id="detail-tags"
                value={editTagsText}
                onChange={(e) => setEditTagsText(e.target.value)}
                placeholder="Add tags"
                className="form-control mb-2 rounded-sm"
              />
              <small id="tagsHelp" className="form-text text-muted">
                We'll use the first tag as your primary tag. Separate tags using
                a comma.
              </small>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="secondary"
              text="Discard Changes"
              onClick={handleDismiss}
            />
            <Button type="primary" text="Save Changes" onClick={handleSave} />
          </Modal.Footer>
        </Modal>
        {showLinkedinUrl != "" && (
          <a
            className="mt-0 mt-md-2 mx-auto"
            href={showLinkedinUrl}
            target="self"
          >
            <img
              src={LinkedInIcon}
              height={24}
              alt="LinkedIn Icon"
              className="greyscale-img"
            />
          </a>
        )}
      </div>
    </div>
  );
};

export default TalentDetail;
