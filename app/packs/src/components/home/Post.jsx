import React, { useState, useEffect } from "react";
import { parseJSON, formatDistanceToNow } from "date-fns";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTransition, animated } from "@react-spring/web";
import parse from "html-react-parser";
import debounce from "lodash/debounce";

import { post as postRequest, get } from "src/utils/requests";

import TalentProfilePicture from "../talent/TalentProfilePicture";
import Button from "../button";

const Comment = ({ text, username, ticker, profilePictureUrl, created_at }) => {
  const date = parseJSON(created_at);
  const timeSinceCreation = formatDistanceToNow(date);

  return (
    <div className="d-flex flex-row w-100 pt-3 px-3">
      <TalentProfilePicture
        src={profilePictureUrl}
        height={40}
        className="mt-3"
      />
      <div className="d-flex flex-column ml-3 pt-3 border-top w-100">
        <div className="d-flex flex-row">
          <p>
            <strong>{username}</strong>{" "}
            <small className="text-muted ml-2">{timeSinceCreation}</small>
          </p>
        </div>
        <p className="w-100 text-white-space-wrap">{parse(text)}</p>
      </div>
    </div>
  );
};

const CommentSection = ({ post_id, profilePictureUrl, incrementComments }) => {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingComment, setCreatingComment] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);

  console.log(focusedInput);

  const createComment = () => {
    setCreatingComment(true);

    postRequest(`/posts/${post_id}/comments`, { text }).then((response) => {
      if (response.error) {
        console.log(response.error);
      } else {
        // response should be something like: {id: 3, username: "Elon Musk", ticker: "$ELON", text, created_at: new Date()}
        setComments([response, ...comments]);
        incrementComments();
        setText("");
      }

      setCreatingComment(false);
    });
  };

  const debounceSubmit = debounce(() => createComment(), 200);

  const onSubmit = (e) => {
    e.preventDefault();
    debounceSubmit();
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

  return (
    <div className="d-flex flex-column align-items-center mb-3">
      <form
        action={`/posts/${post_id}/comments`}
        method="post"
        onSubmit={onSubmit}
        style={{ zIndex: 1 }}
        className="w-100 px-3 d-flex flex-row mb-3"
      >
        <TalentProfilePicture
          src={profilePictureUrl}
          height={40}
          className="mt-3 mr-3"
        />
        <div className="position-relative w-100 border-top pt-3">
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your reply..."
            className="border-0 form-control"
            rows={focusedInput ? "5" : "1"}
            onFocus={() => setFocusedInput(true)}
            style={{ paddingRight: 80 }}
          />
          {focusedInput && (
            <button
              type="submit"
              disabled={creatingComment == true || text == ""}
              className="btn btn-primary btn-small position-absolute b-24 r-24"
            >
              Reply
            </button>
          )}
        </div>
      </form>
      {!loading && comments.length === 0 && (
        <div className="w-100 px-4 pt-2 text-center mt-3">
          No comments yet. Be the first!
        </div>
      )}
      {!loading &&
        comments.length > 0 &&
        comments.map((item) => <Comment key={item.id} {...item} />)}
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
      <div className="d-flex flex-row w-100 p-3">
        <TalentProfilePicture src={user.profilePictureUrl} height={40} />
        <div className="d-flex flex-column px-3 w-100">
          <div className="d-flex flex-row">
            <p className="mr-2">
              {user.talentUrl ? (
                <a href={user.talentUrl} className="text-reset">
                  <strong>{user.username}</strong>
                </a>
              ) : (
                <strong>{user.username}</strong>
              )}{" "}
              <small className="text-muted">{timeSinceCreation}</small>
            </p>
          </div>
          <p className="text-white-space-wrap">{parse(post.text)}</p>
          <div className="d-flex flex-column-reverse flex-md-row justify-content-between">
            <div className="d-flex flex-row mt-2 mt-md-0">
              <button
                onClick={() => toggleCommentSection()}
                className="ml-2 border-0 bg-transparent"
              >
                <FontAwesomeIcon icon={faComment} />{" "}
                <small>
                  {commentCount} <span className="text-muted">Comments</span>
                </small>
              </button>
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
