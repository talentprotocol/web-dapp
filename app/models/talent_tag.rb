class TalentTag < ApplicationRecord
  belongs_to :talent
  belongs_to :tag

  validates :talent, uniqueness: {scope: :tag, message: "Talent tag already exists"}
end
