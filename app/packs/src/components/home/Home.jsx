import React, { useState } from "react";

import ActiveTalentLeaderboard from "./ActiveTalentLeaderboard";
import UpcomingTalentLeaderboard from "./UpcomingTalentLeaderboard";
import PostInput from "./PostInput";
import Post from "./Post";
import UserMenu from "../user_menu";

const Home = ({ user, posts, activeTalents, upcomingTalents, signOutPath }) => {
  const [currentPosts, setCurrentPosts] = useState(posts);

  const addPost = (post) => {
    setCurrentPosts([post, ...currentPosts]);
  };

  return (
    <>
      <section className="col-12 col-lg-7 lg-h-100 d-flex flex-column flex-wrap py-4">
        {user.isTalent && (
          <PostInput
            profilePictureUrl={user.profilePictureUrl}
            addPost={addPost}
            name={user.displayName}
          />
        )}
        {currentPosts.map((post) => (
          <div key={`post-${post.id}`} className="bg-light mb-4 rounded">
            <Post post={post} user={post.user} currentUser={user} />
          </div>
        ))}
      </section>
      <section className="col-12 col-lg-5 d-flex flex-column lg-h-100 py-4">
        <div className="d-flex flex-row w-100 justify-content-end mb-3">
          <UserMenu user={user} signOutPath={signOutPath} />
        </div>
        <ActiveTalentLeaderboard talents={activeTalents} />
        <UpcomingTalentLeaderboard talents={upcomingTalents} />
      </section>
    </>
  );
};

export default Home;
