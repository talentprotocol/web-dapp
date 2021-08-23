import React, { useState } from "react";
import debounce from "lodash/debounce";
import { post } from "src/utils/requests";

import TalentProfilePicture from "../talent/TalentProfilePicture";

const PostInput = ({ profilePictureUrl, addPost }) => {
  const [text, setText] = useState("");
  const [creatingPost, setCreatingPost] = useState(false);

  const createPost = () => {
    setCreatingPost(true);

    post(`/posts`, { text }).then((response) => {
      if (response.error) {
        console.log(response.error);
      } else {
        addPost(response);
        setText("");
      }
      setCreatingPost(false);
    });
  };

  const debounceSubmit = debounce(() => createPost(), 200);

  const onSubmit = (e) => {
    e.preventDefault();
    debounceSubmit();
  };

  return (
    <form onSubmit={onSubmit} className="d-flex flex-row py-2 w-100">
      <TalentProfilePicture src={profilePictureUrl} height={40} />
      <div className="d-flex flex-column flex-md-row w-100 px-2">
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start a post.."
          className="form-control"
        />
        <button
          type="submit"
          disabled={creatingPost == true || text == ""}
          className="btn btn-primary btn-small ml-0 ml-md-2 mt-2 mt-md-0 md-w-100"
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default PostInput;
