class PublishPost
  def initialize
  end

  def call(post_id:)
    ActiveRecord::Base.transaction do
      post = Post.find(post_id)
      writer = post.user

      # All followers except self in case we're following ourselves
      writer.followers.where.not(id: writer.id).find_each do |follower|
        follower.feed.posts << post
      end

      writer.feed.posts << post

      post
    rescue => e
      Rollbar.error(e, "Unable to propogate post to followers feeds. Feed ##{post_id}")

      raise ActiveRecord::Rollback.new(e)
    end
  end
end
