class CreatePost
  def initialize
  end

  def call(text:, writer:)
    ActiveRecord::Base.transaction do
      post = Post.create(text: text, user: writer)

      writer.followers.find_each do |follower|
        follower.feed.posts << post
      end

      writer.feed.posts << post

      post
    end
  end
end
