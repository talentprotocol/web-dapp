import React, { useState } from "react";

import Pagination from "../pagination";
import Post from "./Post";
import PostInput from "./PostInput";
import TalentLeaderboard from "../leaderboards/TalentLeaderboard";
import Alert from "../alert";
import Button from "../button";

const Feed = ({ posts, user, pagy, topTalents, alert }) => {
  const [currentPosts, setCurrentPosts] = useState(posts);

  const addPost = (post) => {
    setCurrentPosts([post, ...currentPosts]);
  };

  return (
    <>
      <section className="col-12 col-lg-7 mx-auto mx-lg-0 px-0 d-flex flex-column tal-content-side-700 pt-3">
        <h1 className="h5 px-2">
          <strong>Home</strong>
        </h1>
        {user.isTalent && (
          <div className="px-2 border-top border-bottom bg-white border-right">
            <PostInput
              profilePictureUrl={user.profilePictureUrl}
              addPost={(post) => addPost(post)}
            />
          </div>
        )}
        {currentPosts.length == 0 && (
          <p className="mx-2">
            Start following or investing in talent for us to construct your
            feed.
          </p>
        )}
        {currentPosts.map((post) => (
          <div
            key={`post-${post.id}`}
            className="bg-white border-bottom border-right"
          >
            <Post post={post} user={post.user} currentUser={user} />
          </div>
        ))}
        {currentPosts.length > 0 && (
          <Pagination
            prev={pagy.prev}
            next={pagy.next}
            page={pagy.page}
            last={pagy.last}
          />
        )}
      </section>
      <section className="col-12 col-lg-5 p-4 talent-content-body-500">
        <TalentLeaderboard topTalents={topTalents} className="mb-4" />
        {alert.type && (
          <Alert direction="column" centerText={true} {...alert}>
            <p className={`px-5 pt-4 mr-md-3 text-center`}>{alert.text}</p>{" "}
            {alert.href && (
              <Button
                type={alert.type}
                text={alert.buttonText}
                href={alert.href}
                target="self"
                className="talent-button w-100 mx-5 mb-4"
              />
            )}
          </Alert>
        )}
      </section>
    </>
  );
};

export default Feed;
