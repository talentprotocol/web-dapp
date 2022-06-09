class CareerGoal < ApplicationRecord

  has_paper_trail

  belongs_to :talent
  has_many :goals

  def to_s
    "#{target_date}: #{description}"
  end
end
