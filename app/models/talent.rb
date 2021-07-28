class Talent < ApplicationRecord
  include ::ProfilePictureUploader::Attachment(:profile_picture)

  validate :public_key_is_valid

  belongs_to :user, optional: true

  has_one :coin
  has_many :transactions, through: :coin
  has_many :investors, through: :transactions
  has_one :career_goal
  has_many :rewards

  has_many :tags
  has_one :primary_tag, -> { where(primary: true) }, class_name: "Tag"

  scope :active, -> { where("ito_date <= ?", Time.current) }
  scope :upcoming, -> { where("ito_date > ?", Time.current) }

  delegate :wallet_id, to: :user

  def display_wallet_id
    "#{wallet_id[0..10]}..."
  end

  def status
    if ito_date > Time.current
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
    if Integer(public_key).is_a? Integer
      errors.add(:base, "The public key can't be a number")
    end
  rescue ArgumentError
  end
end
