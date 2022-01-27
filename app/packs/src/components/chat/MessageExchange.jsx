import React, { useEffect } from "react";
import Message from "./Message";
import Button from "../button";
import ThemedButton from "src/components/design_system/button";

import TalentProfilePicture from "../talent/TalentProfilePicture";
import P2 from "src/components/design_system/typography/p2";
import TextArea from "src/components/design_system/fields/textarea";
import { Send, ArrowLeft } from "src/components/icons";

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
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  useEffect(() => {
    if (searchParams.has("perk")) {
      searchParams.delete("perk");
      window.history.replaceState(
        {},
        document.title,
        "/messages?" + searchParams.toString()
      );
    }
  }, [props.value]);

  useEffect(() => {
    var messagesDiv = document.getElementById("messages");
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }, [props.messages]);

  const isPreviousMessageFromSameSender = (index) => {
    if (index == 0) {
      return false;
    }

    return (
      props.messages[index - 1].sender_id === props.messages[index].sender_id
    );
  };

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      props.onSubmit(e);
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      {props.smallScreen && (
        <>
          <div className="d-flex flex-row align-items-center w-100 py-2">
            <ThemedButton
              onClick={() => props.clearActiveUserId()}
              type="white-ghost"
              mode={mode}
              className="mx-2 p-2"
            >
              <ArrowLeft color="currentColor" />
            </ThemedButton>
            <TalentProfilePicture
              src={props.profilePictureUrl}
              link={`talent/${props.username}`}
              height={48}
              className="mr-2"
            />
            <P2 mode={mode} bold text={props.username} />
          </div>
          <div className={`divider ${mode}`}></div>
        </>
      )}
      <div
        id="messages"
        className="px-3 overflow-y-scroll display-messages d-flex flex-column pb-3"
      >
        {props.messages.length === 0 && props.activeUserId === 0 && (
          <CommunicateFirst />
        )}
        {props.messages.length === 0 && props.activeUserId !== 0 && (
          <EmptyMessages />
        )}
        {props.messages.map((message, index) => (
          <Message
            key={`message_${message.id}`}
            message={message}
            previousMessageSameUser={isPreviousMessageFromSameSender(index)}
            mine={message.sender_id === props.user.id}
            profilePictureUrl={props.profilePictureUrl}
            username={props.username}
            user={props.user}
          />
        ))}
      </div>
      {props.activeUserId !== 0 && (
        <div className="d-flex flex-row w-100 p-2">
          <TextArea
            mode={mode}
            disabled={
              props.username == undefined ||
              (props.messages.length == 0 && props.user.id == 0)
            }
            onChange={(e) => props.onChange(e.target.value)}
            value={props.value}
            placeholder="Type here"
            className="w-100 mr-2"
            onKeyDown={onEnterPress}
            limitHeight={100}
          />
          <button
            className="button-link send-message-button"
            onClick={props.onSubmit}
            disabled={
              props.value == "" ||
              props.sendingMessage == true ||
              (props.messages.length == 0 && props.user.id == 0)
            }
          >
            <Send color="currentColor" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageExchange;
