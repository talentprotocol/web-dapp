import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { format } from 'date-fns'

import { setupChannel } from "channels/message_channel"

const Message = props => {
  const { message, mine } = props;
  const messageStyle = mine ? "chat-my-message" : "chat-their-message"
  const dateStyle = mine ? "align-self-end" : "align-self-start"

  const sentDate = format(new Date(message.created_at), 'MMM d, yyyy, h:m a')

  return (
    <>
      <p key={`message_${message.id}`} className={`chat-message text-break mt-2 p-3 ${messageStyle}`}>
        {message.text}
      </p>
      <span key={`message_date_${message.id}`} className={`chat-message-date ${dateStyle}`}>{sentDate}</span>
    </>
  )
}

const MessageBoard = props => {
  const { sender, receiver, chat_id } = props
  const [messages, setMessages] = useState(props.messages)
  const [message, setMessage] = useState("")

  useEffect(() => {
    setupChannel(chat_id, getNewMessage)
  });

  const getNewMessage = (response) => setMessages([...messages, response.message])

  const sendNewMessage = (e) => {
    e.preventDefault()

    if (message.replace(/\s+/g, '') == "") {
      return
    }

    const token = document.querySelector('meta[name="csrf-token"]').content

    fetch(`/messages`, {
      credentials: "include",
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: receiver.id, message })
    }).then((response) => response.json())
      .then((response) => {
        if(response.error) {
          setError("Unable to send message, try again")
        } else {
          setMessages([...messages, response])
          setMessage("")
        }
      }) 
  }

  return (
    <div className="container">
      <h2>{sender.username} contacting {receiver.username}</h2>
      <div id="messages" className="d-flex flex-column chat-messages px-3">
        {messages.map((message) =>
          <Message
            message={message}
            mine={message.sender_id === sender.id}
          />)
        }
      </div>
      <form action="/messages" method="post" onSubmit={sendNewMessage}>
        <div className="position-relative chat-send-area">
          <input type="text" name="message" id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Start a new message" className="form-control chat-input-area"/>
          <button type="submit" class="position-absolute btn btn-primary btn-small chat-send">
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

// sender: { id: 1, username: "mike", email: "mike@gmail.com", display_name: "mike" } <- current_user
// receiver: { id: 2, username: "john", email: "john@gmail.com", display_name: "john" }
// messages: [
//  { sender_id: 1, receiver_id: 2, text: "Hello, how are you?" },
//  { sender_id: 2, receiver_id: 1, text: "Well, how about you?" }
// ]

MessageBoard.defaultProps = { }

MessageBoard.propTypes = { }

export default MessageBoard
