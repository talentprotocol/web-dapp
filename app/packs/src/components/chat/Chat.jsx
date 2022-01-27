import React, { useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import debounce from "lodash/debounce";

import { post, get } from "src/utils/requests";
import { setupChannel, removeChannel } from "channels/message_channel";

import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

import MessageUserList from "./MessageUserList";
import MessageExchange from "./MessageExchange";
import { useWindowDimensionsHook } from "../../utils/window";

const Chat = ({ users, user }) => {
  const url = new URL(document.location);
  const [activeUserId, setActiveUserId] = useState(
    url.searchParams.get("user") || 0
  );
  const [localUsers, setLocalUsers] = useState(users);
  const [perkId, setPerkId] = useState(url.searchParams.get("perk") || 0);
  const [activeChannel, setActiveChannel] = useState(null); // @TODO: Refactor chat
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [lastMessageId, setLastMessageId] = useState(0);
  const [chatId, setChatId] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [gettingMessages, setGettingMessages] = useState(false);
  const [messengerProfilePicture, setMessengerProfilePicture] = useState();
  const [messengerUsername, setMessengerUsername] = useState();
  const { mobile } = useWindowDimensionsHook();
  const theme = useContext(ThemeContext);

  // Get user from URL
  useEffect(() => {
    if (activeUserId == 0) {
      return;
    }

    if (activeUserId == user.id) {
      window.location.replace("/messages");
    }

    setGettingMessages(true);
    setMessage("");
    setMessages([]);

    get(`messages/${activeUserId}`).then((response) => {
      setMessages(response.messages);
      setLastMessageId(response.messages[response.messages.length - 1]?.id);
      setChatId(response.chat_id);
      setMessengerProfilePicture(response.profilePictureUrl);
      setMessengerUsername(response.username);
      setGettingMessages(false);
    });
  }, [activeUserId]);

  useEffect(() => {
    if (perkId <= 0) {
      return;
    }

    get(`api/v1/perks/${perkId}`).then((response) => {
      if (response.title) {
        setMessage(
          `Hi! I'm reaching out because of your perk "${response.title}"`
        );
      }
    });
  }, [perkId]);

  useEffect(() => {
    if (chatId != "") {
      setActiveChannel(setupChannel(chatId, getNewMessage));
    }

    return () => {
      if (activeChannel) {
        removeChannel(activeChannel);
      }
    };
  }, [chatId, messages]);

  useEffect(() => {
    const element = document.getElementById(`message-date-${lastMessageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [lastMessageId, messages]);

  const getNewMessage = (response) => {
    setMessages([...messages, response.message]);
    setLastMessageId(response.message.id);
  };

  const updateUsers = (prevUsers, response) => {
    const receiverIndex = prevUsers.findIndex(
      (user) => user.id === response.receiver_id
    );
    const formatedDate = dayjs(response.created_at).format("MMM D");
    return [
      ...prevUsers.slice(0, receiverIndex),
      {
        ...prevUsers[receiverIndex],
        last_message: response.text,
        last_message_date: formatedDate,
      },
      ...prevUsers.slice(receiverIndex + 1),
    ];
  };

  const sendNewMessage = () => {
    if (message.replace(/\s+/g, "") == "") {
      return;
    }

    setSendingMessage(true);

    post("/messages", { id: activeUserId, message }).then((response) => {
      if (response.error) {
        console.log(response.error);
        // setError("Unable to send message, try again") // @TODO: Create error box (absolute positioned)
      } else {
        setLocalUsers((prevUsers) => updateUsers(prevUsers, response));
        setMessages([...messages, response]);
        setLastMessageId(response.id);
        setMessage("");
      }
      setSendingMessage(false);
    });
  };

  const debouncedNewMessage = debounce(() => sendNewMessage(), 200);

  const ignoreAndCallDebounce = (e) => {
    e.preventDefault();
    debouncedNewMessage();
  };

  const clearActiveUser = () => {
    setActiveUserId(0);
    setMessages([]);
    setMessage("");
  };

  const setActiveUser = (userId) => {
    setActiveUserId(userId);
    window.history.replaceState({}, document.title, `/messages?user=${userId}`);
  };

  return (
    <>
      <div className="d-flex flex-column w-100 h-100">
        <main className="d-flex flex-row w-100 h-100 themed-border-top">
          {(!mobile || activeUserId == 0) && (
            <section className="col-lg-3 mx-auto mx-lg-0 px-0 d-flex flex-column themed-border-right">
              <MessageUserList
                onClick={(userId) => setActiveUser(userId)}
                activeUserId={activeUserId}
                users={localUsers}
                mode={theme.mode()}
                mobile={mobile}
              />
            </section>
          )}
          {(!mobile || activeUserId > 0) && !gettingMessages && (
            <section className="col-lg-9 px-0 lg-overflow-y-hidden">
              <MessageExchange
                smallScreen={mobile}
                activeUserId={activeUserId}
                clearActiveUserId={() => clearActiveUser()}
                value={message}
                onChange={setMessage}
                onSubmit={ignoreAndCallDebounce}
                messages={messages}
                sendingMessage={sendingMessage}
                user={user}
                profilePictureUrl={messengerProfilePicture}
                username={messengerUsername}
                mode={theme.mode()}
              />
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer>
      <Chat {...props} railsContext={railsContext} />
    </ThemeContainer>
  );
};
