import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import debounce from "lodash/debounce";

import { get } from "src/utils/requests";
import TalentProfilePicture from "../talent/TalentProfilePicture";

import { Spinner } from "src/components/icons";
import { P1, P2 } from "src/components/design_system/typography";
import TextInput from "src/components/design_system/fields/textinput";
import Link from "src/components/design_system/link";
import { Search } from "src/components/icons";

const NewMessageModal = ({ show, setShow, onUserChosen, mobile }) => {
  if (!show) {
    return null;
  }
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    if (search.length < 3) {
      return;
    }

    setLoading(true);

    const response = await get(
      `api/v1/users?name=${search}&messaging_disabled=false`
    ).catch(() => setLoading(false));

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
      <Modal.Body className="show-grid p-0">
        <P1 className="pt-4 pb-3 px-4" text={"New message"} bold />
        <div className="d-flex flex-row mb-4 mx-4 position-relative align-items-center">
          <TextInput
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search for people..."
            inputClassName="pl-5"
            className="w-100"
          />
          <Search
            color="currentColor"
            className="position-absolute chat-search-icon"
          />
        </div>
        <div className="w-100 d-flex flex-column new-message-user-list px-4">
          {showLoadingState() && (
            <div className="w-100 d-flex flex-row my-2 justify-content-center">
              <Spinner />
            </div>
          )}
          {users.map((user) => (
            <button
              key={`new_message_user_${user.id}`}
              className="button-link"
              onClick={() => onUserChosen(user)}
            >
              <Link
                className="w-100 d-flex flex-row align-items-center my-2"
                type="white"
              >
                <TalentProfilePicture
                  src={user.profilePictureUrl}
                  height={40}
                />
                <P2 className="mb-0 ml-3" bold text={user.username} />
              </Link>
            </button>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NewMessageModal;
