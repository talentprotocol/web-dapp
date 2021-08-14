class Post < ApplicationRecord
  belongs_to :user

  has_many :comments, dependent: :destroy
  has_many :feed_posts, dependent: :destroy
  has_many :feeds, through: :feed_posts

  def to_json
    {
      id: id,
      text: text,
      created_at: created_at.to_s,
      comments: comments.count,
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
end
