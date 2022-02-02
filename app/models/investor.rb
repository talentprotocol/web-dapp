class Investor < ApplicationRecord
  include ::ProfilePictureUploader::Attachment(:profile_picture)

  belongs_to :user, optional: true

  delegate :wallet_id, :username, to: :user

  def display_wallet_id
    "#{wallet_id[0..10]}..."
  end
end
