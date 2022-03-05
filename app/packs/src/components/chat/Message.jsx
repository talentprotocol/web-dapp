import React from "react";
import dayjs from "dayjs";
import { LinkItEmail, LinkItUrl } from 'react-linkify-it';

import TalentProfilePicture from "../talent/TalentProfilePicture";
import P2 from "src/components/design_system/typography/p2";
import P3 from "src/components/design_system/typography/p3";

const MessageLinkified = (props) => {
  return (
    <LinkItUrl>
      <LinkItEmail>
          {props.message}
      </LinkItEmail>
    </LinkItUrl>
  )
}

const Message = (props) => {
  const {
    message,
    mine,
    profilePictureUrl,
    username,
    profileLink,
    previousMessageSameUser,
    user,
  } = props;

  const sentDate = dayjs(message.created_at).format("MMM D, YYYY, h:mm A");

  return (
    <div className="d-flex flex-row w-100 mt-2 message-div">
      {!previousMessageSameUser && (
        <TalentProfilePicture
          src={mine ? user.profilePictureUrl : profilePictureUrl}
          link={profileLink}
          height={48}
          className="mb-auto mt-3"
        />
      )}
      <div
        className={`d-flex flex-column w-100 ${
          previousMessageSameUser ? "messages-from-same-user" : "ml-3"
        }`}
      >
        {!previousMessageSameUser && (
          <div className="d-flex flex-row w-100 align-items-center mt-3">
            <P2
              bold
              text={mine ? user.username : username}
              className="mb-0 text-primary"
            />
            <P3 text={sentDate} className="mb-0 ml-2" />
          </div>
        )}
        <P2 className={"text-white-space-wrap"}>
          <MessageLinkified message={message.text}/>
        </P2>
      </div>
    </div>
  );
};

export default Message;
