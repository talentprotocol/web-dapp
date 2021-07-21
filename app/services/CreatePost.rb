class CreatePost
  def initialize
  end

  def call(text, writer)
    post = Post.create(text: text, user: writer)

    writer.followers.find_each do |follower|
      follower.feed.posts << post
    end
  end
end
