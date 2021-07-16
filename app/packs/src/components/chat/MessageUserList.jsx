import React, { useState } from 'react'
import {
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import TalentProfilePicture from '../talent/TalentProfilePicture'
import Button from '../button'

const UserMessage = ({ user, activeUserId, onClick }) => {
  const message = user.last_message.length > 30 ? `${user.last_message.substring(0,28)}...` : user.last_message
  const active = user.id == activeUserId ? " active" : ""

  return (
    <a className={`w-100 p-3 border-top chat-user${active} text-reset`} onClick={() => onClick(user.id)}>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <TalentProfilePicture src={user.profilePictureUrl} height={40} greyscale={!active}/>
        <div className="d-flex flex-column w-100 pl-2">
          <div className="d-flex flex-row justify-content-between">
            <div className="d-flex flex-row">
              <p className={`mb-0 mr-2${active ? ' text-primary' : ''}`}><small><strong>{user.username}</strong></small></p>
              <p className="text-muted mb-0"><small>{user.ticker}</small></p>
            </div>
            <p className="text-muted mb-0"><small>{user.last_message_date}</small></p>
          </div>
          <p className="mb-0"><small>{message}</small></p>
        </div>
      </div>
    </a>
  )
}

const filteredUsers = (users, search) => users.filter((user) => user.username.includes(search))

const EmptyUsers = () => (
  <div className="w-100 p-3 border-top d-flex flex-column align-items-center">
    <p className="text-muted mb-0"><small>You need to start a chat with someone!</small></p>
    <Button type="primary" text="See Talents" href="/talent" size="sm"/>
  </div>
)

const MessageUserList = ({ users, activeUserId, onClick }) => {
  const [search, setSearch] = useState("")

  return (
    <div className="d-flex flex-column align-items-stretch lg-h-100">
      <h1 className="h6 px-3"><strong>Messages</strong></h1>
      <div className="w-100 p-2 border-top position-relative">
        <input
          type="text"
          name="searchChat"
          id="searchChat"
          value={search}
          disabled={users.length < 2}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search messages..."
          className="chat-input-area border w-100 p-2 pl-5"
        />
        <FontAwesomeIcon icon={faSearch} className="position-absolute chat-search-icon" size="lg"/>
      </div>
      {users.length == 0 && <EmptyUsers />}
      {filteredUsers(users, search).map((user) => <UserMessage onClick={onClick} key={`user-message-list-${user.id}`} user={user} activeUserId={activeUserId}/>)}
    </div>
  )
}

export default MessageUserList