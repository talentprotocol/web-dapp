import React from "react"
import { format } from 'date-fns'

import TalentProfilePicture from "../talent/TalentProfilePicture";

const Message = props => {
  const { message, mine } = props;
  const messageStyle = mine ? "chat-my-message" : "chat-their-message"
  const dateStyle = mine ? "align-self-end" : "align-self-start"

  const sentDate = format(new Date(message.created_at), 'MMM d, yyyy, h:m a')

  return (
    <div className="d-flex flex-row">
      {!mine && <TalentProfilePicture src={message.profilePictureUrl} height={40} className="mt-auto mb-4"/>}
      <div className="d-flex flex-column w-100">
        <p key={`message_text_${message.id}`} className={`chat-message text-break mt-2 p-3 ${messageStyle}${!mine ? ' ml-2' : ''}`}>
          {message.text}
        </p>
        <span id={`message-date-${message.id}`} key={`message_date_${message.id}`} className={`chat-message-date mb-2 ${dateStyle}${!mine ? ' ml-2' : ''}`}>{sentDate}</span>
      </div>
    </div>
  )
}

export default Message
