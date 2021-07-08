class Reward < ApplicationRecord
  belongs_to :talent

  def to_s
    "#{required_amount.to_s(:delimited)}: #{description}"
  end
end
