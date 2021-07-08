class CareerGoal < ApplicationRecord
  belongs_to :talent

  def to_s
    "#{target_date}: #{description}"
  end
end
