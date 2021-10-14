import React, { useState } from "react";

import PostInput from "./PostInput";
import Post from "./Post";

const Home = ({ user, posts }) => {
  const [currentPosts, setCurrentPosts] = useState(posts);

  const addPost = (post) => {
    setCurrentPosts([post, ...currentPosts]);
  };

  return (
    <>
      <section className="col-12 col-lg-7 lg-h-100 d-flex flex-column py-4">
        <PostInput
          profilePictureUrl={user.profilePictureUrl}
          addPost={addPost}
          name={user.displayName}
        />
        {currentPosts.map((post) => (
          <div key={`post-${post.id}`} className="bg-light mb-4 rounded">
            <Post post={post} user={post.user} currentUser={user} />
          </div>
        ))}
      </section>
      <section className="col-12 col-lg-5 lg-h-100">
        <p>leaderboards</p>
      </section>
    </>
  );
};

export default Home;
