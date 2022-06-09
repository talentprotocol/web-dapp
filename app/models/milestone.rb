class Milestone < ApplicationRecord
  
  has_paper_trail

  belongs_to :talent
end
