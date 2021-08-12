import React, { useEffect, useState } from "react";

import { post, get } from "src/utils/requests";
import { setupChannel, removeChannel } from "channels/message_channel";

import MessageUserList from "./MessageUserList";
import MessageExchange from "./MessageExchange";
import { useWindowDimensionsHook } from "../../utils/window";

const Chat = ({ users }) => {
  const url = new URL(document.location);
  const [activeUserId, setActiveUserId] = useState(
    url.searchParams.get("user") || 0
  );
  const [activeChannel, setActiveChannel] = useState(null); // @TODO: Refactor chat
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(0);
  const [lastMessageId, setLastMessageId] = useState(0);
  const [chatId, setChatId] = useState("");
  const [messengerProfilePicture, setMessengerProfilePicture] = useState();
  const { height, width } = useWindowDimensionsHook();

  // Get user from URL
  useEffect(() => {}, []);

  useEffect(() => {
    if (activeUserId == 0) {
      return;
    }

    setMessage("");
    setMessages([]);

    get(`messages/${activeUserId}.json`).then((response) => {
      setMessages(response.messages);
      setLastMessageId(response.messages[response.messages.length - 1]?.id);
      setUserId(response.current_user_id);
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

  const sendNewMessage = (e) => {
    e.preventDefault();

    if (message.replace(/\s+/g, "") == "") {
      return;
    }

    post("/messages", { id: activeUserId, message }).then((response) => {
      if (response.error) {
        console.log(response.error);
        // setError("Unable to send message, try again") // @TODO: Create error box (absolute positioned)
      } else {
        setMessages([...messages, response]);
        setLastMessageId(response.id);
        setMessage("");
      }
    });
  };

  const clearActiveUser = () => {
    setActiveUserId(0);
    setMessages([]);
    setMessage("");
  };

  return (
    <>
      {(width > 992 || activeUserId == 0) && (
        <section className="col-lg-5 mx-auto mx-lg-0 px-0 d-flex flex-column tal-content-side-500 lg-overflow-y-scroll border-right pt-3">
          <MessageUserList
            onClick={(user_id) => setActiveUserId(user_id)}
            activeUserId={activeUserId}
            users={users}
          />
        </section>
      )}
      {(width > 992 || activeUserId > 0) && (
        <section className="col-lg-7 bg-white px-0 border-right talent-content-body-700 lg-overflow-y-hidden">
          <MessageExchange
            smallScreen={width <= 992}
            clearActiveUserId={() => clearActiveUser()}
            value={message}
            onChange={setMessage}
            onSubmit={sendNewMessage}
            messages={messages}
            userId={userId}
            profilePictureUrl={messengerProfilePicture}
          />
        </section>
      )}
    </>
  );
};

export default Chat;
