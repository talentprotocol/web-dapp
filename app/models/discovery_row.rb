class DiscoveryRow < ApplicationRecord
  include ::ProfilePictureUploader::Attachment(:logo)
  extend FriendlyId

  has_many :tags

  has_many :visible_tags, -> { visible }, class_name: "Tag"

  validates :title, :slug, presence: true, uniqueness: true

  friendly_id :title, use: :slugged

  def talents_count
    Talent.base
      .joins(:token)
      .joins(user: {tags: :discovery_row})
      .where(discovery_rows: {id: id})
      .count
  end
end
