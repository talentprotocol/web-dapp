import React from "react";
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
      <form
        action="/messages"
        method="post"
        onSubmit={props.onSubmit}
        className="input-message-height"
      >
        <div className="position-relative chat-send-area">
          <input
            type="text"
            disabled={props.messages.length == 0 && props.userId == 0}
            name="message"
            id="message"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder="Start a new message"
            className="form-control chat-input-area"
          />
          <button
            type="submit"
            disabled={
              props.value == "" ||
              props.sendingMessage == true ||
              (props.messages.length == 0 && props.userId == 0)
            }
            className="position-absolute btn btn-primary btn-small chat-send"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageExchange;
