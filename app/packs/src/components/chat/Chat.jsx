import React, { useEffect, useState } from "react";
import debounce from "lodash/debounce";

import { post, get } from "src/utils/requests";
import { setupChannel, removeChannel } from "channels/message_channel";

import MessageUserList from "./MessageUserList";
import MessageExchange from "./MessageExchange";
import { useWindowDimensionsHook } from "../../utils/window";

const Chat = ({ users, userId }) => {
  const url = new URL(document.location);
  const [activeUserId, setActiveUserId] = useState(
    url.searchParams.get("user") || 0
  );
  const [activeChannel, setActiveChannel] = useState(null); // @TODO: Refactor chat
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [lastMessageId, setLastMessageId] = useState(0);
  const [chatId, setChatId] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messengerProfilePicture, setMessengerProfilePicture] = useState();
  const { height, width } = useWindowDimensionsHook();

  // Get user from URL
  useEffect(() => {}, []);

  useEffect(() => {
    if (activeUserId == 0) {
      return;
    }

    if (activeUserId == userId) {
      window.location.replace("/messages");
    }

    setMessage("");
    setMessages([]);

    get(`messages/${activeUserId}`).then((response) => {
      setMessages(response.messages);
      setLastMessageId(response.messages[response.messages.length - 1]?.id);
      setChatId(response.chat_id);
      setMessengerProfilePicture(response.profilePictureUrl);
    });
  }, [activeUserId]);

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

  return (
    <>
      {(width > 992 || activeUserId == 0) && (
        <section className="col-lg-5 mx-auto mx-lg-0 px-0 d-flex flex-column lg-overflow-y-scroll border-right pt-3">
          <MessageUserList
            onClick={(user_id) => setActiveUserId(user_id)}
            activeUserId={activeUserId}
            users={users}
          />
        </section>
      )}
      {(width > 992 || activeUserId > 0) && (
        <section className="col-lg-7 bg-white px-0 border-right lg-overflow-y-hidden">
          <MessageExchange
            smallScreen={width <= 992}
            clearActiveUserId={() => clearActiveUser()}
            value={message}
            onChange={setMessage}
            onSubmit={ignoreAndCallDebounce}
            messages={messages}
            sendingMessage={sendingMessage}
            userId={userId}
            profilePictureUrl={messengerProfilePicture}
          />
        </section>
      )}
    </>
  );
};

export default Chat;
