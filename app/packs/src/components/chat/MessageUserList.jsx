import React, { useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TalentProfilePicture from "../talent/TalentProfilePicture";
import Button from "../button";
import NewMessageModal from "./NewMessageModal";

const lastMessageText = (lastMessage) => {
  if (lastMessage) {
    return lastMessage.length > 30
      ? `${lastMessage.substring(0, 28)}...`
      : lastMessage;
  } else {
    return "Send your first message!";
  }
};

const UserMessage = ({ user, activeUserId, onClick }) => {
  const message = lastMessageText(user.last_message);
  const active = user.id == activeUserId ? " active" : "";

  return (
    <a
      className={`w-100 p-3 border-top chat-user${active} text-reset`}
      onClick={() => onClick(user.id)}
    >
      <div className="d-flex flex-row justify-content-between align-items-center">
        <TalentProfilePicture
          src={user.profilePictureUrl}
          height={40}
          greyscale={!active}
        />
        <div className="d-flex flex-column w-100 pl-2">
          <div className="d-flex flex-row justify-content-between">
            <div className="d-flex flex-row">
              <p className={`mb-0 mr-2${active ? " text-primary" : ""}`}>
                <small>
                  <strong>{user.username}</strong>
                </small>
              </p>
              <p className="text-muted mb-0">
                <small>{user.ticker ? `$${user.ticker}` : ""}</small>
              </p>
            </div>
            <p className="text-muted mb-0">
              <small>{user.last_message_date}</small>
            </p>
          </div>

          <div className="d-flex flex-row mb-0 justify-content-between">
            <small>{message}</small>
            <UnreadMessagesCount count={user.unreadMessagesCount} />
          </div>
        </div>
      </div>
    </a>
  );
};

const UnreadMessagesCount = ({ count }) => {
  count ||= 0;

  if (count > 0) {
    const value = count > 99 ? "+99" : count.toString();
    return (
      <span class="chat-unread-count">{value}</span>
    );
  } else {
    return null;
  }
};

const filteredUsers = (users, search) =>
  users.filter((user) => user.username.includes(search));

const EmptyUsers = () => (
  <div className="w-100 p-3 border-top d-flex flex-column align-items-center">
    <p className="text-muted mb-0">
      <small>You need to start a chat with someone!</small>
    </p>
    <Button type="primary" text="See Talent" href="/talent" size="sm" />
  </div>
);

const MessageUserList = ({ users, activeUserId, onClick }) => {
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [allUsers, setAllUsers] = useState(users);

  const onNewMessageUser = (user) => {
    onClick(user.id);
    const index = allUsers.findIndex((u) => u.id == user.id);
    if (index < 0) {
      setAllUsers((prev) => [...prev, user]);
    }
    setShow(false);
  };

  return (
    <>
      <NewMessageModal
        show={show}
        setShow={setShow}
        onUserChosen={onNewMessageUser}
      />
      <div className="d-flex flex-column align-items-stretch lg-h-100">
        <div className="w-100 d-flex flex-row p-2 border-top position-relative align-items-center">
          <input
            type="text"
            name="searchChat"
            id="searchChat"
            value={search}
            disabled={allUsers.length == 0}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for people..."
            className="chat-input-area border w-100 p-2 pl-5"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="position-absolute chat-search-icon"
            size="lg"
          />
          <div className="ml-2 bg-light p-2" onClick={() => setShow(true)}>
            <FontAwesomeIcon
              icon={faComment}
              size="lg"
              className="text-muted hover-black"
            />
          </div>
        </div>
        {allUsers.length == 0 && <EmptyUsers />}
        {filteredUsers(allUsers, search).map((user) => (
          <UserMessage
            onClick={onClick}
            key={`user-message-list-${user.id}`}
            user={user}
            activeUserId={activeUserId}
          />
        ))}
      </div>
    </>
  );
};

export default MessageUserList;
