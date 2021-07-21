import React, { useState } from 'react'

import Pagination from "../pagination"
import Post from './Post'
import PostInput from './PostInput'

const Feed = ({ posts, user, pagy }) => {
  const [currentPosts, setCurrentPosts] = useState(posts)

  const addPost = (post) => {
    setCurrentPosts([post, ...currentPosts])
  }

  return (
    <>
      <section className="col-12 col-lg-7 mx-auto mx-lg-0 px-0 d-flex flex-column tal-content-side-700 lg-overflow-scroll border-right pt-3">
        <h1 className="h5 px-2"><strong>Home</strong></h1>
        {user.isTalent &&
          <div className="px-2 border-top border-bottom bg-white">
            <PostInput profilePictureUrl={user.profilePictureUrl} addPost={(post) => addPost(post)}/>
          </div>
        }
        {currentPosts.map((post) => (
          <div key={`post-${post.id}`} className="bg-white border-bottom">
            <Post post={post} user={post.user}/>
          </div>))}
        <Pagination prev={pagy.prev} next={pagy.next} page={pagy.page} last={pagy.last} />
      </section>
      <section className="col-12 col-lg-5 px-0 border-right talent-content-body-500 lg-overflow-hidden">
        <div>The other section</div>
      </section>
    </>
  )
}

export default Feed
