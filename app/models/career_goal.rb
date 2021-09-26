class CareerGoal < ApplicationRecord
  belongs_to :talent
  has_many :goals

  def to_s
    "#{target_date}: #{description}"
  end
end
