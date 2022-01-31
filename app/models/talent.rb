class Talent < ApplicationRecord
  include ::ProfilePictureUploader::Attachment(:profile_picture)
  include ::TalentBannerUploader::Attachment(:banner)

  store :profile, accessors: %i[
    pronouns
    location
    headline
    website
    video
    wallet_address
    email
    linkedin
    twitter
    telegram
    discord
    github
    occupation
  ], coder: JSON

  validate :public_key_is_valid

  belongs_to :user, optional: true

  has_one :token
  has_one :career_goal
  has_many :perks
  has_many :services
  has_many :milestones
  has_many :talent_badges
  has_many :badges, through: :talent_badges

  has_many :tags
  has_one :primary_tag, -> { where(primary: true) }, class_name: "Tag"

  scope :active, -> { where("ito_date <= ?", Time.current) }
  scope :upcoming, -> { where("ito_date > ? OR ito_date is NULL", Time.current) }

  delegate :wallet_id, :username, to: :user

  def display_wallet_id
    "#{wallet_id[0..10]}..."
  end

  def status
    if token.contract_id.nil?
      "Upcoming"
    else
      "Active"
    end
  end

  def active?
    status == "Active"
  end

  def to_param
    return nil unless persisted?
    user&.username || id
  end

  def banner_url
    banner(:default)&.url || super
  end

  def profile_picture_url
    profile_picture(:default)&.url || super
  end

  private

  def public_key_is_valid
    if public_key.present? && Integer(public_key).is_a?(Integer)
      errors.add(:base, "The public key can't be a number")
    end
  rescue ArgumentError
  end
end
