class Post < ApplicationRecord
  belongs_to :user

  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :feed_posts, dependent: :destroy
  has_many :feeds, through: :feed_posts

  def to_json
    {
      id: id,
      text: text,
      created_at: created_at.to_s,
      comments: comments.count,
      likes: likes.count,
      user: {
        id: user.id,
        username: user.username,
        ticker: user.talent&.coin&.display_ticker,
        price: user.talent&.coin&.display_price,
        profilePictureUrl: user.talent.profile_picture_url,
        active: user.talent.active?
      }
    }
  end

  def to_json_for(target_user)
    to_json.merge(i_liked: likes.where(user_id: target_user.id).exists?)
  end
end
