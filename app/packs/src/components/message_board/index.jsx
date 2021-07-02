import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { format } from 'date-fns'

import { setupChannel } from "channels/message_channel"
import Message from "./Message"
import { post } from "src/utils/requests"

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

    post(
      "/messages",
      { id: receiver.id, message }
    ).then((response) => {
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
            key={`message_${message.id}`}
            message={message}
            mine={message.sender_id === sender.id}
          />)
        }
      </div>
      <form action="/messages" method="post" onSubmit={sendNewMessage}>
        <div className="position-relative chat-send-area">
          <input type="text" name="message" id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Start a new message" className="form-control chat-input-area"/>
          <button type="submit" className="position-absolute btn btn-primary btn-small chat-send">
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

MessageBoard.defaultProps = { }

MessageBoard.propTypes = { }

export default MessageBoard
