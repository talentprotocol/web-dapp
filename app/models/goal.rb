class Goal < ApplicationRecord
  belongs_to :career_goal

  def to_s
    "#{due_date}: #{description}"
  end
end
