class CreateFollow
  def initialize
  end

  def call(user_id:, follower_id:)
    ActiveRecord::Base.transaction do
      user = User.find_by!(id: user_id)
      follower = User.find_by!(id: follower_id)

      follow = Follow.new(user: user, follower: follower)

      user.posts.each do |post|
        follower.feed.posts << post
      end

      follow.save!
    end
  end
end
