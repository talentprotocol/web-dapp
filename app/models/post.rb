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
        ticker: user.talent&.token&.display_ticker,
        contract_id: user.talent&.token&.contract_id,
        profilePictureUrl: user.talent.profile_picture_url,
        talentUrl: user.talent && user.talent.id != 1 ? "/talent/#{user.username}" : nil,
        active: user.talent.active?
      }
    }
  end
end
