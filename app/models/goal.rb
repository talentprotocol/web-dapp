class Goal < ApplicationRecord
  has_paper_trail

  belongs_to :career_goal

  def to_s
    "#{due_date}: #{description}"
  end
end
