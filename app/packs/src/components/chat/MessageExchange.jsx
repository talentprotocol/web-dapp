import React from 'react'
import Message from './Message'

const EmptyMessages = () => {
  return (
    <div>Send your first message!</div>
  )
}

const MessageExchange = (props) => {
  return (
    <div className="messages-background h-100">
      <div id="messages" className="px-3 lg-overflow-scroll display-messages d-flex flex-column pb-3">
        {props.messages.length == 0 && <EmptyMessages />}
        {props.messages.map((message) =>
          <Message
            key={`message_${message.id}`}
            message={message}
            mine={message.sender_id === props.userId}
          />)
        }
      </div>
      <form action="/messages" method="post" onSubmit={props.onSubmit} className="input-message-height">
        <div className="position-relative chat-send-area">
          <input type="text" name="message" id="message" value={props.value} onChange={(e) => props.onChange(e.target.value)} placeholder="Start a new message" className="form-control chat-input-area"/>
          <button type="submit" className="position-absolute btn btn-primary btn-small chat-send">
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessageExchange