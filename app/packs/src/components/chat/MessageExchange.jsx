import React, { useRef, useEffect, useState } from "react";
import Message from "./Message";
import Button from "../button";

const EmptyMessages = () => {
  return (
    <div className="my-auto align-self-center">Send your first message!</div>
  );
};

const CommunicateFirst = () => {
  return (
    <div className="my-auto align-self-center">Find someone to chat with!</div>
  );
};

const MessageExchange = (props) => {
  const inputElement = useRef(null);
  const [height, setHeight] = useState(38);

  useEffect(() => {
    if (!inputElement) {
      return;
    }

    setHeight((prev) => inputElement.current.scrollHeight + 2);
  }, [props.value]);

  return (
    <div className="messages-background lg-h-100 d-flex flex-column">
      {props.smallScreen && (
        <Button
          type="primary"
          text="<- Go back"
          className="talent-button w-100 text-left"
          onClick={() => props.clearActiveUserId()}
        />
      )}
      <div
        id="messages"
        className="px-3 lg-overflow-y-scroll display-messages d-flex flex-column pb-3"
      >
        {props.messages.length == 0 && props.userId == 0 && (
          <CommunicateFirst />
        )}
        {props.messages.length == 0 && props.userId != 0 && <EmptyMessages />}
        {props.messages.map((message) => (
          <Message
            key={`message_${message.id}`}
            message={message}
            mine={message.sender_id === props.userId}
            profilePictureUrl={props.profilePictureUrl}
          />
        ))}
      </div>
      <form action="/messages" method="post" onSubmit={props.onSubmit}>
        <div className="d-flex flex-row justify-content-center align-items-center chat-send-area">
          <textarea
            ref={inputElement}
            type="text"
            disabled={props.messages.length == 0 && props.userId == 0}
            name="message"
            id="message"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder="Start a new message"
            className="form-control w-100 mr-2 chat-input-area"
            style={{ height }}
          />
          <button
            type="submit"
            disabled={
              props.value == "" ||
              props.sendingMessage == true ||
              (props.messages.length == 0 && props.userId == 0)
            }
            className="btn btn-primary btn-small"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageExchange;
