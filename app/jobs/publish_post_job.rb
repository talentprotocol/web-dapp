class PublishPostJob < ApplicationJob
  queue_as :default

  def perform(post_id, created_at)
    post = Post.find(post_id)

    unless post.created_at.to_s == created_at
      service = PublishPost.new
      service.call(post_id: post.id)
    end
  end
end
