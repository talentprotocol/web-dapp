class Tag < ApplicationRecord
  belongs_to :discovery_row, optional: true
  has_many :user_tags
  has_many :talents, through: :user_tags

  validates :description, presence: true

  scope :visible, -> { where(hidden: false) }

  def to_s
    description
  end
end
