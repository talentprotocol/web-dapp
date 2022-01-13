import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import debounce from "lodash/debounce";

import { get } from "src/utils/requests";
import TalentProfilePicture from "../talent/TalentProfilePicture";

import { Spinner } from "src/components/icons";
import P1 from "src/components/design_system/typography/p1";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";

const NewMessageModal = ({ show, setShow, onUserChosen, mode, mobile }) => {
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
    <Modal
      scrollable={true}
      show={show}
      centered
      onHide={() => setShow(false)}
      dialogClassName={mobile ? "mw-100 mh-100 m-0" : "remove-background"}
      fullscreen={"md-down"}
    >
      <Modal.Body className="show-grid p-4">
        <P1 text={"New message"} bold mode={mode} />
        <div className="w-100 d-flex flex-row py-2 position-relative align-items-center">
          <TextInput
            mode={`${mode} pl-5`}
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search for people..."
            className="w-100 p-2"
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
              <Spinner />
            </div>
          )}
          {users.map((user) => (
            <a
              key={`new_message_user_${user.id}`}
              className="w-100 d-flex flex-row align-items-center my-2 text-reset hover-primary"
              onClick={() => onUserChosen(user)}
            >
              <TalentProfilePicture src={user.profilePictureUrl} height={40} />
              <P2 mode={mode} className="mb-0 ml-3" bold text={user.username} />
            </a>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NewMessageModal;
