class Investor < ApplicationRecord
  include ::ProfilePictureUploader::Attachment(:profile_picture)
  include ::BannerUploader::Attachment(:banner)

  store :profile, accessors: %i[
    location
    headline
    website
    linkedin
    twitter
    telegram
    discord
    github
    occupation
  ], coder: JSON

  belongs_to :user, optional: true

  delegate :wallet_id, :username, to: :user

  def display_wallet_id
    "#{wallet_id[0..10]}..."
  end
end
