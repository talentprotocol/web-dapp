class Talent < ApplicationRecord
  include ::ProfilePictureUploader::Attachment(:profile_picture)

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
end
