import React, { useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TalentProfilePicture from "../talent/TalentProfilePicture";
import Button from "../button";
import NewMessageModal from "./NewMessageModal";
import ThemedButton from "src/components/design_system/button";
import P2 from "src/components/design_system/typography/p2";
import P3 from "src/components/design_system/typography/p3";
import TextInput from "src/components/design_system/fields/textinput";
import { NewChat } from "src/components/icons";

const lastMessageText = (lastMessage) => {
  if (lastMessage) {
    return lastMessage.length > 30
      ? `${lastMessage.substring(0, 28)}...`
      : lastMessage;
  } else {
    return "Send your first message!";
  }
};

const UserMessage = ({ user, activeUserId, onClick, mode }) => {
  const message = lastMessageText(user.last_message);
  const active = user.id == activeUserId ? " active" : "";

  return (
    <a
      className={`w-100 p-3 themed-border-bottom chat-user${active} text-reset`}
      onClick={() => onClick(user.id)}
    >
      <div className="d-flex flex-row justify-content-between align-items-center">
        <TalentProfilePicture
          src={user.profilePictureUrl}
          height={48}
          greyscale={!active}
        />
        <div className="d-flex flex-column w-100 pl-2 ml-2">
          <div className="d-flex flex-row justify-content-between">
            <div className="d-flex flex-row">
              <P2 mode={mode} text={user.username} bold className="mr-2" />
            </div>
            <P3 mode={mode} text={user.last_message_date} />
          </div>
          <div className="d-flex flex-row mb-0 justify-content-between">
            <P2 mode={mode} text={message} className="mr-2" />
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
    return <span className="chat-unread-count">{value}</span>;
  } else {
    return null;
  }
};

const filteredUsers = (users, search) =>
  users.filter((user) => user.username.includes(search));

const EmptyUsers = () => (
  <div className="w-100 p-3 themed-border-top d-flex flex-column align-items-center">
    <p className="text-muted mb-0">
      <small>You need to start a chat with someone!</small>
    </p>
    <Button type="primary" text="See Talent" href="/talent" size="sm" />
  </div>
);

const MessageUserList = ({ users, activeUserId, onClick, mode, mobile }) => {
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
        mobile={mobile}
        mobe={mode}
      />
      <div className="d-flex flex-column align-items-stretch lg-h-100">
        <div className="w-100 d-flex flex-row p-2 position-relative themed-border-bottom align-items-center">
          <TextInput
            mode={`${mode} pl-5`}
            disabled={allUsers.length == 0}
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
          <ThemedButton
            onClick={() => setShow(true)}
            type="white-subtle"
            mode={mode}
            className="ml-2 p-2"
          >
            <NewChat color="currentColor" />
          </ThemedButton>
        </div>
        {allUsers.length == 0 && <EmptyUsers />}
        {filteredUsers(allUsers, search).map((user) => (
          <UserMessage
            onClick={onClick}
            key={`user-message-list-${user.id}`}
            user={user}
            activeUserId={activeUserId}
            mode={mode}
          />
        ))}
      </div>
    </>
  );
};

export default MessageUserList;
