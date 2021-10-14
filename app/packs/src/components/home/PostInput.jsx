import React, { useState } from "react";
import debounce from "lodash/debounce";
import { post } from "src/utils/requests";
import { Modal } from "react-bootstrap";
import { faImage, faSmileBeam } from "@fortawesome/free-regular-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TalentProfilePicture from "../talent/TalentProfilePicture";

const CreatePostModal = ({ show, hide, onSubmit, profilePictureUrl, name }) => (
  <Modal show={show} onHide={hide} centered>
    <Modal.Body>
      <form className="p-3 d-flex flex-column" onSubmit={onSubmit}>
        <div className="d-flex flex-row">
          <TalentProfilePicture
            src={profilePictureUrl}
            height={40}
            className="mr-2"
          />
          <textarea
            className="w-100 border-0 form-control"
            placeholder={`What do you want to share, ${name}?`}
            rows={5}
          />
        </div>
        <div className="d-flex flex-row justify-content-end align-items-center w-100 mt-3">
          <button className="btn btn-light talent-button mr-2" onClick={hide}>
            Cancel
          </button>
          <button className="btn btn-primary talent-button" type="submit">
            Post
          </button>
        </div>
      </form>
    </Modal.Body>
  </Modal>
);

const PostInput = ({ profilePictureUrl, name, addPost }) => {
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);

  const createPost = () => {
    setCreatingPost(true);

    post(`/posts`, { text }).then((response) => {
      if (response.error) {
        console.log(response.error);
      } else {
        addPost(response);
        setText("");
      }
      setCreatingPost(false);
    });
  };

  const debounceSubmit = debounce(() => createPost(), 200);

  const onSubmit = (e) => {
    e.preventDefault();
    debounceSubmit();
  };

  return (
    <div className="d-flex flex-row align-items-center w-100 mb-4">
      <TalentProfilePicture src={profilePictureUrl} height={40} />
      <button
        className="btn btn-light w-100 ml-3 text-left text-muted talent-button"
        onClick={() => setShowModal(true)}
      >
        What do you want to share, {name}?
      </button>
      <CreatePostModal
        show={showModal}
        profilePictureUrl={profilePictureUrl}
        hide={() => setShowModal(false)}
        onSubmit={onSubmit}
        name={name}
      />
    </div>
  );
};

export default PostInput;
