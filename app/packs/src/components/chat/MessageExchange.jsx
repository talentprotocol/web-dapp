import React, { useEffect } from "react";
import Message from "./Message";
import Button from "../button";
import ThemedButton from "src/components/design_system/button";

import TextArea from "src/components/design_system/fields/textarea";
import { Send } from "src/components/icons";

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
  const { mode } = props;

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if (params.has("perk")) {
      params.delete("perk");
      window.history.replaceState(
        {},
        document.title,
        "/messages?" + params.toString()
      );
    }
  }, [props.value]);

  const isPreviousMessageFromSameSender = (index) => {
    if (index == 0) {
      return false;
    }

    return (
      props.messages[index - 1].sender_id === props.messages[index].sender_id
    );
  };

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
        {props.messages.length == 0 && props.user.id == 0 && (
          <CommunicateFirst />
        )}
        {props.messages.length == 0 && props.user.id != 0 && <EmptyMessages />}
        {props.messages.map((message, index) => (
          <Message
            key={`message_${message.id}`}
            message={message}
            previousMessageSameUser={isPreviousMessageFromSameSender(index)}
            mine={message.sender_id === props.user.id}
            profilePictureUrl={props.profilePictureUrl}
            username={props.username}
            user={props.user}
            mode={mode}
          />
        ))}
      </div>
      <div className="d-flex flex-row w-100 p-2">
        <TextArea
          mode={mode}
          disabled={
            props.username == undefined ||
            (props.messages.length == 0 && props.user.id == 0)
          }
          onChange={(e) => props.onChange(e.target.value)}
          value={props.value}
          placeholder="Start a new message"
          className="w-100 mr-2"
        />
        <ThemedButton
          onClick={props.onSubmit}
          disabled={
            props.value == "" ||
            props.sendingMessage == true ||
            (props.messages.length == 0 && props.user.id == 0)
          }
          type="primary-ghost"
          mode={mode}
          className="ml-2 -p2"
        >
          <Send color="currentColor" />
        </ThemedButton>
      </div>
    </div>
  );
};

export default MessageExchange;
