class DiscoveryRow < ApplicationRecord
  extend FriendlyId

  belongs_to :partnership, optional: true

  has_many :tags
  has_many :visible_tags, -> { visible }, class_name: "Tag"

  validates :title, :slug, presence: true, uniqueness: true

  friendly_id :title, use: :slugged

  def talents_count
    public_talent_profiles.count
  end

  def talents_total_supply
    public_talent_profiles.pluck(:total_supply).sum(&:to_i).to_s
  end

  private

  def public_talent_profiles
    Talent.base
      .joins(:token)
      .joins(user: {tags: :discovery_row})
      .where(discovery_rows: {id: id})
      .distinct
  end
end
