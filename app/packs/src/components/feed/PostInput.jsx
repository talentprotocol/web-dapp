import React, { useState } from 'react'
import { post } from "src/utils/requests"

import TalentProfilePicture from '../talent/TalentProfilePicture'

const PostInput = ({ profilePictureUrl }) => {
  const [text, setText] = useState("")

  const onSubmit = (e) => {
    e.preventDefault()

    post(
      `/posts`,
      { text }
    ).then((response) => {
      if(response.error) {
        console.log(response.error)
      } else {
        setText("")
      }
    })
  }

  return (
    <form action={`/posts`} method="post" onSubmit={onSubmit} className="d-flex flex-row py-2 w-100">
      <TalentProfilePicture src={profilePictureUrl} height={40}/>
      <textarea id="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Start a post.." className="mx-3 form-control"/>
      <button type="submit" className="btn btn-primary btn-small">
        Create
      </button>
    </form>
  )
}

export default PostInput