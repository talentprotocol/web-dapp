class Tag < ApplicationRecord
  belongs_to :talent

  def to_s
    description
  end
end
