import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get } from "src/utils/requests";
import debounce from "lodash/debounce";

import TalentProfilePicture from "../talent/TalentProfilePicture";

const NewMessageModal = ({ show, setShow, onUserChosen }) => {
  if (!show) {
    return null;
  }
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);

    const response = await get(`api/v1/users?name=${search}`).catch(() =>
      setLoading(false)
    );

    if (response.users) {
      setUsers(response.users);
    }

    setLoading(false);
  };

  const debouncedFetch = debounce(() => fetchUsers(), 200);

  useEffect(() => {
    debouncedFetch();
  }, [search]);

  const showLoadingState = () => loading == true && users.length == 0;

  return (
    <Modal scrollable={true} show={show} centered onHide={() => setShow(false)}>
      <Modal.Body className="show-grid p-4 bg-light">
        <p>
          <strong>New message</strong>
        </p>
        <div className="w-100 d-flex flex-row py-2 position-relative align-items-center">
          <input
            type="text"
            name="searchChat"
            id="searchChat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people"
            className="chat-input-area border w-100 p-2 pl-5"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="position-absolute chat-search-icon"
            size="lg"
          />
        </div>
        <div className="w-100 d-flex flex-column new-message-user-list">
          {showLoadingState() && (
            <div className="w-100 d-flex flex-row my-2 justify-content-center">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Loading
            </div>
          )}
          {users.map((user) => (
            <a
              key={`new_message_user_${user.id}`}
              className="w-100 d-flex flex-row align-items-center my-2 text-reset hover-primary"
              onClick={() => onUserChosen(user)}
            >
              <TalentProfilePicture src={user.profilePictureUrl} height={40} />
              <p className="mb-0 ml-3">{user.username}</p>
            </a>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NewMessageModal;
