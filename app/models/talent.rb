class Talent < ApplicationRecord
  include ::ProfilePictureUploader::Attachment(:profile_picture)

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
    ocupation
  ], coder: JSON

  validate :public_key_is_valid

  belongs_to :user, optional: true

  has_one :token
  has_many :transactions, through: :token
  has_many :investors, through: :transactions
  has_one :career_goal
  has_many :perks
  has_many :services
  has_many :milestones

  has_many :tags
  has_one :primary_tag, -> { where(primary: true) }, class_name: "Tag"

  scope :active, -> { where("ito_date <= ?", Time.current) }
  scope :upcoming, -> { where("ito_date > ? OR ito_date is NULL", Time.current) }

  delegate :wallet_id, :username, to: :user

  def display_wallet_id
    "#{wallet_id[0..10]}..."
  end

  def status
    if ito_date.nil?
      "Inactive"
    elsif ito_date > Time.current
      "Upcoming"
    else
      "Active"
    end
  end

  def active?
    status == "Active"
  end

  private

  def public_key_is_valid
    if public_key.present? && Integer(public_key).is_a?(Integer)
      errors.add(:base, "The public key can't be a number")
    end
  rescue ArgumentError
  end
end
