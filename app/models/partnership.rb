class Partnership < ApplicationRecord
  include ::ProfilePictureUploader::Attachment(:logo)

  belongs_to :invite, optional: true
  has_one :discovery_row

  validates :name, presence: true, uniqueness: true
end
