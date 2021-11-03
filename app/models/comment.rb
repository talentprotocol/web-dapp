class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :post

  def to_json
    {
      id: id,
      username: user.display_name.blank? ? user.username : user.display_name,
      ticker: user.talent&.token&.ticker,
      profilePictureUrl: user.talent&.profile_picture_url || user.investor&.profile_picture_url,
      text: text,
      created_at: created_at.to_s
    }
  end
end
