class Badge < ApplicationRecord
  include ::ImageUploader::Attachment(:image)

  has_many :talent_badges
  has_many :talents, through: :talent_badges

  validates_presence_of :name
end
