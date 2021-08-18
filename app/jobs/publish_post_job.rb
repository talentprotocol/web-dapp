class PublishPostJob < ApplicationJob
  queue_as :default

  def perform(*args)
    post_id = args[0][:post_id]
    created_at = args[0][:created_at]

    post = Post.find(post_id)

    if post.created_at.to_s == created_at
      service = PublishPost.new
      service.call(post_id: post.id)
    end
  end
end
