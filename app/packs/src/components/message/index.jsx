import React from "react"
import PropTypes from "prop-types"
import { format } from 'date-fns'

const Message = props => {
  const { message, mine } = props;
  const messageStyle = mine ? "chat-my-message" : "chat-their-message"
  const dateStyle = mine ? "align-self-end" : "align-self-start"

  const sentDate = format(new Date(message.created_at), 'MMM d, yyyy, h:m a')

  return (
    <>
      <p key={`message_text_${message.id}`} className={`chat-message text-break mt-2 p-3 ${messageStyle}`}>
        {message.text}
      </p>
      <span key={`message_date_${message.id}`} className={`chat-message-date ${dateStyle}`}>{sentDate}</span>
    </>
  )
}

export default Message