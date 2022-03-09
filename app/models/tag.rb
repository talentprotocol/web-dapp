class Tag < ApplicationRecord
  has_one :discovery_row
  has_many :user_tags
  has_many :talents, through: :user_tags

  def to_s
    description
  end
end
