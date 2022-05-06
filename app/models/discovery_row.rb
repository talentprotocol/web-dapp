class DiscoveryRow < ApplicationRecord
  extend FriendlyId

  has_many :tags

  validates :title, :slug, presence: true, uniqueness: true

  friendly_id :title, use: :slugged
end
