import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";

import { patch } from "src/utils/requests";

import Button from "../../button";

const AboutMe = ({ description, youtubeUrl, allowEdit, talentId }) => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [aboutMeText, setAboutMeText] = useState(description || "");
  const [editYoutubeUrl, setEditYoutubeUrl] = useState(youtubeUrl || "");
  const textInputRef = useRef(null);

  const handleShow = () => setShow(true);
  const handleDismiss = () => {
    setAboutMeText(description);
    setShow(false);
  };
  const handleSave = async () => {
    const response = await patch(`/talent/${talentId}`, {
      talent: { description: aboutMeText, youtube_url: editYoutubeUrl },
    });
    if (response.error) {
      setError(true);
    } else {
      setShow(false);
    }
  };

  useEffect(() => {
    if (show && textInputRef && textInputRef.current.scrollHeight > 20) {
      textInputRef.current.style.height =
        textInputRef.current.scrollHeight + 3 + "px";
    }
  }, [show]);

  return (
    <div className="mb-3 mb-md-5">
      <div className="d-flex flex-row mb-3 align-items-center">
        <h6 className="talent-show-h6 p-2 mr-2">ABOUT ME</h6>
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
            <Modal.Title>Edit About Me</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && (
              <p className="text-danger">
                Unable to update description. Check if you added invalid
                characters.
              </p>
            )}
            <div className="form-group">
              <label forhtml="text">Description</label>
              <textarea
                ref={textInputRef}
                id="text"
                value={aboutMeText}
                onChange={(e) => setAboutMeText(e.target.value)}
                placeholder="Add a brief description.."
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label forhtml="about-me-youtube">Youtube</label>
              <input
                type="text"
                name="youtube"
                id="detail-youtube"
                value={editYoutubeUrl}
                onChange={(e) => setEditYoutubeUrl(e.target.value)}
                placeholder="Add a youtube URL"
                className="form-control mb-2 rounded-sm"
              />
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
      </div>
      <p className="mt-3 mb-0 talent-long-description">{aboutMeText}</p>
      {youtubeUrl && (
        <div className="talent-profile-video-player mt-3 mx-auto">
          <ReactPlayer url={youtubeUrl} light width={"100%"} height={"100%"} />
        </div>
      )}
    </div>
  );
};

export default AboutMe;
