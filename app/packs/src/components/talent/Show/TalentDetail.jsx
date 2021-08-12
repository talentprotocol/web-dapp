import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import { faEdit, faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";

import { patch, post } from "src/utils/requests";
import LinkedInIcon from "images/linkedin.png";

import Button from "../../button";
import TalentProfilePicture from "../TalentProfilePicture";
import TalentTags from "../TalentTags";

const TalentDetail = ({
  talentId,
  profilePictureUrl,
  username,
  ticker,
  tags,
  linkedinUrl,
  allowEdit,
  tokenDeployed,
}) => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [editLinkedinUrl, setEditLinkedinUrl] = useState(linkedinUrl);
  const [editTicker, setEditTicker] = useState(ticker);
  const [editTagsText, setEditTagsText] = useState(tags.join(", "));
  const profilePictureInputRef = useRef(null);

  const handleShow = () => setShow(true);
  const handleDismiss = () => setShow(false);
  const handleSave = async () => {
    console.log(profilePictureInputRef.current.files[0]);

    const formData = new FormData();
    formData.append("talent[linkedin_url]", editLinkedinUrl);
    formData.append("talent[ticker]", editTicker);
    formData.append(
      "talent[profile_picture]",
      profilePictureInputRef.current.files[0]
    );

    const response = await patch(`/talent/${talentId}`, formData);
    if (response.error) {
      setError(true);
    } else {
      setShow(false);
    }
  };

  return (
    <div className="mb-3 mb-md-5 d-flex flex-column flex-md-row align-items-center">
      <TalentProfilePicture src={profilePictureUrl} height={96} />
      <div className="d-flex flex-column ml-2">
        <h1 className="h2">
          <small>
            {username} <span className="text-muted">({ticker})</span>
          </small>
        </h1>
        <TalentTags tags={tags} />
      </div>
      <div className="ml-md-auto d-flex flex-row-reverse flex-md-column justify-content-between align-items-end mt-2 mt-md-0">
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
              <label forhtml="detail-profile-picture">Profile picture</label>
              <input
                ref={profilePictureInputRef}
                type="file"
                name="profile-picture"
                id="detail-profile-picture"
                className="form-control-file"
              />
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
        <a className="mt-0 mt-md-2 mx-auto" href={linkedinUrl}>
          <img
            src={LinkedInIcon}
            height={24}
            alt="LinkedIn Icon"
            className="greyscale-img"
          />
        </a>
      </div>
    </div>
  );
};

export default TalentDetail;
