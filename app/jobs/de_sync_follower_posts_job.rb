class DeSyncFollowerPostsJob < ApplicationJob
  queue_as :default

  def perform(*args)
    user_id = args[0][:user_id]
    follower_id = args[0][:follower_id]

    service = DeSyncFollowerPosts.new
    service.call(user_id: user_id, follower_id: follower_id)
  end
end
