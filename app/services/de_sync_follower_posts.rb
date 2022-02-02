class DeSyncFollowerPosts
  def initialize
  end

  def call(user_id:, follower_id:)
    user = User.find_by!(id: user_id)
    follower = User.find_by!(id: follower_id)

    ActiveRecord::Base.transaction do
      follower.feed.feed_posts.where(post_id: user.posts.pluck(:id)).find_each do |feed_post|
        feed_post.destroy
      end
    end

    true
  end
end
