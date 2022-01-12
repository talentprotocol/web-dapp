import React from "react";
import { format } from "date-fns";

import TalentProfilePicture from "../talent/TalentProfilePicture";
import P2 from "src/components/design_system/typography/p2";
import P3 from "src/components/design_system/typography/p3";

const Message = (props) => {
  const {
    message,
    mine,
    profilePictureUrl,
    username,
    previousMessageSameUser,
    mode,
    user,
  } = props;
  const sentDate = format(new Date(message.created_at), "MMM d, yyyy, h:m a");

  return (
    <div className="d-flex flex-row w-100 mt-3">
      {!previousMessageSameUser && (
        <TalentProfilePicture
          src={mine ? user.profilePictureUrl : profilePictureUrl}
          height={48}
          className="mb-auto mt-2"
        />
      )}
      <div
        className={`d-flex flex-column w-100 ${
          previousMessageSameUser ? "messages-from-same-user" : "ml-3"
        }`}
      >
        {!previousMessageSameUser && (
          <div className="d-flex flex-row w-100 align-items-center">
            <P2
              mode={mode}
              bold
              text={mine ? user.username : username}
              className="mb-0 text-primary"
            />
            <P3 mode={mode} text={sentDate} className="mb-0 ml-2" />
          </div>
        )}
        <P2
          mode={mode}
          text={message.text}
          className={"text-white-space-wrap"}
        />
      </div>
    </div>
  );
};

export default Message;
