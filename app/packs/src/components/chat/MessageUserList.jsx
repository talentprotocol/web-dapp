import React, { useState, useEffect } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import TalentProfilePicture from "../talent/TalentProfilePicture";
import NewMessageModal from "./NewMessageModal";
import ThemedButton from "src/components/design_system/button";
import { P2, P3 } from "src/components/design_system/typography";
import TextInput from "src/components/design_system/fields/textinput";
import { NewChat, Search } from "src/components/icons";

const lastMessageText = (lastMessage) => {
  if (lastMessage) {
    return lastMessage.length > 30
      ? `${lastMessage.substring(0, 28)}...`
      : lastMessage;
  } else {
    return "";
  }
};

const UserMessage = ({ user, activeUserId, onClick, mode }) => {
  const message = lastMessageText(user.last_message);
  const active = user.id == activeUserId ? " active" : "";

  const displayTime = () => {
    if (user.last_message_date) {
      return dayjs(user.last_message_date).fromNow();
    } else {
      return "";
    }
  };

  return (
    <a
      className={`pt-3 pl-6 pr-6 chat-user ${active} text-reset`}
      onClick={() => onClick(user.id)}
    >
      <div className="d-flex flex-row justify-content-between themed-border-bottom">
        <TalentProfilePicture src={user.profilePictureUrl} height={48} />
        <div className="d-flex flex-column w-100 h-100 pl-2 pb-3 ml-2">
          <div style={{ minHeight: 48 }}>
            <div className="d-flex flex-row justify-content-between">
              <div className="d-flex flex-row">
                <P2 text={user.username} bold className="mr-2" />
              </div>
              <P3 text={displayTime()} />
            </div>
            <div className="d-flex flex-row mb-0 justify-content-between">
              <P2 text={message} className="mr-2" />
              <UnreadMessagesCount count={user.unreadMessagesCount} />
            </div>
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
  users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

const EmptyUsers = ({ mode }) => (
  <div className="w-100 p-3 themed-border-top d-flex flex-column align-items-center">
    <ThemedButton
      onClick={() => (window.location.href = "/talent")}
      type="primary-default"
      mode={mode}
    >
      Browse Talent
    </ThemedButton>
  </div>
);

const sortUsers = (user1, user2) => {
  const date1 = dayjs(user1.last_message_date);
  const date2 = dayjs(user2.last_message_date);

  if (date1.isBefore(date2)) {
    return 1;
  } else if (date1.isAfter(date2)) {
    return -1;
  }
  return 0;
};

const MessageUserList = ({
  users,
  setUsers,
  activeUserId,
  onClick,
  mode,
  mobile,
}) => {
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);

  const onNewMessageUser = (user) => {
    onClick(user.id);
    const index = users.findIndex((u) => u.id == user.id);
    if (index < 0) {
      setUsers((prev) => [...prev, user]);
    }
    setShow(false);
  };

  const sortedUsers = users.sort(sortUsers);

  return (
    <>
      <NewMessageModal
        show={show}
        setShow={setShow}
        onUserChosen={onNewMessageUser}
        mobile={mobile}
      />
      <div className="d-flex flex-column align-items-stretch lg-h-100">
        <div className="w-100 d-flex flex-row themed-border-bottom align-items-center py-4 pl-6 pr-6">
          <div className="position-relative w-100">
            <TextInput
              disabled={users.length == 0}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder="Search in messages..."
              inputClassName="pl-5"
              className="w-100"
            />
            <Search
              color="currentColor"
              className="position-absolute chat-search-icon"
            />
          </div>
          <ThemedButton
            onClick={() => setShow(true)}
            type="white-subtle"
            mode={mode}
            className="ml-2 p-2"
            size="icon"
          >
            <NewChat color="currentColor" />
          </ThemedButton>
        </div>
        {sortedUsers.length == 0 && <EmptyUsers mode={mode} />}
        <div className="w-100 d-flex flex-column lg-overflow-y-auto">
          {filteredUsers(sortedUsers, search).map((user) => (
            <UserMessage
              onClick={onClick}
              key={`user-message-list-${user.id}`}
              user={user}
              activeUserId={activeUserId}
              mode={mode}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default MessageUserList;
