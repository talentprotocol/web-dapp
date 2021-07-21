import React, { useState, useEffect } from 'react'
import { parseJSON, formatDistanceToNow } from 'date-fns'
import {
  faHeart
} from '@fortawesome/free-solid-svg-icons'
import {
  faHeart as faHeartBorder,
  faComment
} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { post, get } from "src/utils/requests"

import TalentProfilePicture from '../talent/TalentProfilePicture'
import Button from '../button'

const Comment = ({ text, username, ticker, profilePictureUrl, created_at}) => {
  const date = parseJSON(created_at)
  const timeSinceCreation = formatDistanceToNow(date)

  return (
    <div className="d-flex flex-row w-100 pt-3 pl-3 border-top">
      <TalentProfilePicture src={profilePictureUrl} height={40}/>
      <div className="d-flex flex-column pl-3 w-100">
        <div className="d-flex flex-row justify-content-between">
          <p><strong>{username}</strong> <small className="text-muted">{'\u25CF'} {timeSinceCreation}</small></p>
          <p><small><span className="text-primary">{ticker}</span></small></p>
        </div>
        <p className="w-100">{text}</p>
      </div>
    </div>
  )
}

const CommentSection = ({ post_id, profilePictureUrl }) => {
  const [text, setText] = useState("")
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  const onSubmit = (e) => {
    e.preventDefault()

    post(
      `/posts/${post_id}/comments`,
      { text }
    ).then((response) => {
      if(response.error) {
        console.log(response.error)
      } else {
        // response should be something like: {id: 3, username: "Elon Musk", ticker: "$ELON", text, created_at: new Date()}
        setComments([...comments, response])
        setText("")
      }
    })
  }

  useEffect(() => {
    get(`posts/${post_id}/comments.json`)
      .then((response) => {
        if(response.error) {
          setLoading(false)
        } else {
          // response should be something like: [{ id: 1, text: "Well done mate!", username: "Jane Doe", ticker: "$JANE", created_at: "2021-07-21 10:25:15 UTC" }]
          setComments(response.comments)
          setLoading(false)
        }
      })
  }, [post_id])

  return (
    <div className="d-flex flex-column align-items-center border-top mb-3">
      <form action={`/posts/${post_id}/comments`} method="post" onSubmit={onSubmit} className="w-100 py-3 pl-3">
        <div className="d-flex flex-row">
          <TalentProfilePicture src={profilePictureUrl} height={40}/>
          <textarea id="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a new comment.." className="mx-3 form-control"/>
          <button type="submit" className="btn btn-primary btn-small">
            Reply
          </button>
        </div>
      </form>
      {!loading && comments.length === 0 && <div className="w-100 pl-3 pt-2 border-top text-center">No comments yet. Be the first!</div>}
      {!loading && comments.length > 0 && comments.map((comment) => <Comment key={comment.id} {...comment} />)}
    </div>
  )
}

const Post = (props) => {
  const [like, setLike] = useState(props.post.i_liked)
  const [commentSectionActive, setCommentSectionActive] = useState(false)

  const date = parseJSON(props.post.created_at)
  const timeSinceCreation = formatDistanceToNow(date)

  const toggleCommentSection = () => {
    setCommentSectionActive(!commentSectionActive)
  }

  const onLikeClick = () => {
    setLike(true)
  }

  const onUnlikeClick = () => {
    setLike(false)
  }

  return (
    <div className="d-flex flex-column border-bottom">
      <div className="d-flex flex-row w-100 py-3 bg-white">
        <TalentProfilePicture src={props.user.profilePictureUrl} height={40}/>
        <div className="d-flex flex-column pl-3">
          <div className="d-flex flex-row justify-content-between">
            <p><strong>{props.user.username}</strong> <small className="text-muted">{'\u25CF'} {timeSinceCreation}</small></p>
            <p><small><span className="text-primary">{props.user.ticker}</span> <span className="text-muted">{'->'} {props.user.price}</span></small></p>
          </div>
          <p>{props.post.text}</p>
          <div className="d-flex flex-row justify-content-between">
            <div className="d-flex flex-row">
              {like &&
                <button onClick={() => onLikeClick()} className="border-0 bg-transparent">
                  <FontAwesomeIcon icon={faHeart} className="text-danger"/> {props.post.likes}
                </button>}
              {!like &&
                <button onClick={() => onUnlikeClick()} className="border-0 bg-transparent">
                  <FontAwesomeIcon icon={faHeartBorder}/> {props.post.likes}
                </button>
              }
              <button onClick={() => toggleCommentSection()} className="ml-2 border-0 bg-transparent">
                <FontAwesomeIcon icon={faComment} flip="horizontal"/> {props.post.comments}
              </button>
            </div>
            <div className="d-flex flex-row">
              <Button type="outline-secondary" text="Message"/>
              <Button type="primary" text={`Buy ${props.user.ticker}`} className="talent-button ml-2"/>
            </div>
          </div>
        </div>
      </div>
      {commentSectionActive && <CommentSection post_id={props.post.id}/>}
    </div>
  )
}

export default Post