import React, { useEffect, useState, useContext } from "react";
import debounce from "lodash/debounce";

import { post, get } from "src/utils/requests";
import { setupChannel, removeChannel } from "channels/message_channel";

import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

import MessageUserList from "./MessageUserList";
import MessageExchange from "./MessageExchange";
import { useWindowDimensionsHook } from "../../utils/window";

const Chat = ({ users, userId, user }) => {
  const url = new URL(document.location);
  const [activeUserId, setActiveUserId] = useState(
    url.searchParams.get("user") || 0
  );
  const [perkId, setPerkId] = useState(url.searchParams.get("perk") || 0);
  const [activeChannel, setActiveChannel] = useState(null); // @TODO: Refactor chat
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [lastMessageId, setLastMessageId] = useState(0);
  const [chatId, setChatId] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messengerProfilePicture, setMessengerProfilePicture] = useState();
  const [messengerUsername, setMessengerUsername] = useState();
  const { height, width } = useWindowDimensionsHook();
  const theme = useContext(ThemeContext);
  const mobile = width < 992;

  // Get user from URL
  useEffect(() => {
    if (activeUserId == 0) {
      return;
    }

    if (activeUserId == user.id) {
      window.location.replace("/messages");
    }

    setMessage("");
    setMessages([]);

    get(`messages/${activeUserId}`).then((response) => {
      setMessages(response.messages);
      setLastMessageId(response.messages[response.messages.length - 1]?.id);
      setChatId(response.chat_id);
      setMessengerProfilePicture(response.profilePictureUrl);
      setMessengerUsername(response.username);
    });
  }, [activeUserId]);

  useEffect(() => {
    if (perkId <= 0) {
      return;
    }

    get(`api/v1/perks/${perkId}`).then((response) => {
      if (response.title) {
        setMessage(
          `Hi! I'm reaching out because of my perk "${response.title}"`
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
      <div className="d-flex flex-column w-100 h-100">
        <main className="d-flex flex-row w-100 h-100 themed-border-top">
          {(!mobile || activeUserId == 0) && (
            <section className="col-lg-5 mx-auto mx-lg-0 px-0 d-flex flex-column lg-overflow-y-scroll themed-border-right">
              <MessageUserList
                onClick={(user_id) => setActiveUserId(user_id)}
                activeUserId={activeUserId}
                users={users}
                mode={theme.mode()}
                mobile={mobile}
              />
            </section>
          )}
          {(!mobile || activeUserId > 0) && (
            <section className="col-lg-7 px-0 lg-overflow-y-hidden">
              <MessageExchange
                smallScreen={mobile}
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
