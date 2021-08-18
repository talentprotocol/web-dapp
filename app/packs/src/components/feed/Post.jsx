import React, { useState, useEffect } from "react";
import { parseJSON, formatDistanceToNow } from "date-fns";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTransition, animated } from "@react-spring/web";

import { post as postRequest, get } from "src/utils/requests";

import TalentProfilePicture from "../talent/TalentProfilePicture";
import Button from "../button";

const Comment = ({ text, username, ticker, profilePictureUrl, created_at }) => {
  const date = parseJSON(created_at);
  const timeSinceCreation = formatDistanceToNow(date);

  return (
    <div className="d-flex flex-row w-100 pt-3 pl-4 pr-2 border-top bg-white">
      <TalentProfilePicture src={profilePictureUrl} height={40} />
      <div className="d-flex flex-column pl-3 w-100">
        <div className="d-flex flex-row justify-content-between">
          <p>
            <strong>{username}</strong>{" "}
            <small className="text-muted">
              {"\u25CF"} {timeSinceCreation}
            </small>
          </p>
          <p>
            <small>
              <span className="text-primary">{ticker}</span>
            </small>
          </p>
        </div>
        <p className="w-100 text-white-space-wrap">{text}</p>
      </div>
    </div>
  );
};

const CommentSection = ({ post_id, profilePictureUrl, incrementComments }) => {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const onSubmit = (e) => {
    e.preventDefault();

    postRequest(`/posts/${post_id}/comments`, { text }).then((response) => {
      if (response.error) {
        console.log(response.error);
      } else {
        // response should be something like: {id: 3, username: "Elon Musk", ticker: "$ELON", text, created_at: new Date()}
        setComments([response, ...comments]);
        incrementComments();
        setText("");
      }
    });
  };

  useEffect(() => {
    get(`posts/${post_id}/comments`).then((response) => {
      if (response.error) {
        setLoading(false);
      } else {
        // response should be something like: [{ id: 1, text: "Well done mate!", username: "Jane Doe", ticker: "$JANE", created_at: "2021-07-21 10:25:15 UTC" }]
        setComments(response);
        setLoading(false);
      }
    });
  }, [post_id]);

  const transitions = useTransition(comments, {
    from: { translateY: -100, opacity: 0 },
    enter: { translateY: 0, opacity: 1 },
    leave: { translateY: 100, opacity: 0 },
  });

  return (
    <div className="d-flex flex-column align-items-center border-top mb-3">
      <form
        action={`/posts/${post_id}/comments`}
        method="post"
        onSubmit={onSubmit}
        style={{ zIndex: 1 }}
        className="w-100 py-3 pl-4 d-flex flex-row bg-white"
      >
        <TalentProfilePicture src={profilePictureUrl} height={40} />
        <div className="d-flex flex-column flex-md-row w-100 px-2">
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a new comment.."
            className="form-control"
          />
          <button
            type="submit"
            disabled={text == ""}
            className="btn btn-primary btn-small ml-0 ml-md-2 mt-2 mt-md-0 md-w-100"
          >
            Reply
          </button>
        </div>
      </form>
      {!loading && comments.length === 0 && (
        <div className="w-100 px-4 pt-2 border-top text-center">
          No comments yet. Be the first!
        </div>
      )}
      {!loading &&
        comments.length > 0 &&
        transitions((style, item) => (
          <animated.div style={style} className="d-flex flex-row w-100">
            <Comment key={item.id} {...item} />
          </animated.div>
        ))}
    </div>
  );
};

const Post = ({ post, user, currentUser }) => {
  const [commentCount, setCommentCount] = useState(post.comments);
  const [commentSectionActive, setCommentSectionActive] = useState(false);

  const date = parseJSON(post.created_at);
  const timeSinceCreation = formatDistanceToNow(date);
  const buyButtonText = user.active
    ? `Buy ${user.ticker}`
    : `${user.ticker} coming soon.`;

  const toggleCommentSection = () => {
    setCommentSectionActive(!commentSectionActive);
  };

  const incrementComments = () => setCommentCount(commentCount + 1);

  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-row w-100 py-3 px-2">
        <TalentProfilePicture src={user.profilePictureUrl} height={40} />
        <div className="d-flex flex-column pl-3 w-100">
          <div className="d-flex flex-column flex-md-row justify-content-between">
            <p className="mb-0 mb-md-2">
              <strong>{user.username}</strong>{" "}
              <small className="text-muted">
                {"\u25CF"} {timeSinceCreation}
              </small>
            </p>
            <p>
              <small>
                <span className="text-primary">{user.ticker}</span>{" "}
                <span className="text-muted">
                  {"->"} {user.price}
                </span>
              </small>
            </p>
          </div>
          <p className="text-white-space-wrap">{post.text}</p>
          <div className="d-flex flex-column-reverse flex-md-row justify-content-between">
            <div className="d-flex flex-row mt-2 mt-md-0">
              <button
                onClick={() => toggleCommentSection()}
                className="ml-2 border-0 bg-transparent"
              >
                <FontAwesomeIcon icon={faComment} flip="horizontal" />{" "}
                {commentCount}
              </button>
            </div>
            <div className="d-flex flex-row">
              <Button
                type="outline-secondary"
                text="Message"
                href={`/messages?user=${user.id}`}
              />
              <Button
                type="primary"
                href={`/swap?ticker=${user.ticker.substring(1)}`}
                text={buyButtonText}
                disabled={!user.active}
                className="talent-button ml-2"
              />
            </div>
          </div>
        </div>
      </div>
      {commentSectionActive && (
        <CommentSection
          incrementComments={() => incrementComments()}
          profilePictureUrl={currentUser.profilePictureUrl}
          post_id={post.id}
        />
      )}
    </div>
  );
};

export default Post;
