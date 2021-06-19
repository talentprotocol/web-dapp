import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"

import { setupChannel } from "channels/message_channel"

const Message = props => {
  const { message, mine, username } = props;
  const messageStyle = mine ? "align-self-end" : "align-self-start"

  return (
      <p key={`message_${message.id}`} className={`message text-break ${messageStyle}`}>
        {username}: {message.text}
      </p>
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
  const getUser = (id) => {
    if (id == sender.id) {
      return sender
    } else {
      return receiver
    }
  };

  const sendNewMessage = (e) => {
    e.preventDefault()
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
      <div id="messages" className="d-flex flex-column">
        {messages.map((message) =>
          <Message
            message={message}
            username={getUser(message.sender_id).username}
            mine={message.sender_id === sender.id}
          />)
        }
      </div>
      <form action="/messages" method="post" onSubmit={sendNewMessage}>
        <div>
          <input type="text" name="message" id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Start a new message" className="form-control"/>
          <input type="submit" name="commit" value="Send"/>
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
