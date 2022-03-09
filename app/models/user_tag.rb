class UserTag < ApplicationRecord
  has_one :talent
  belongs_to :user
  belongs_to :tag

  validates :user, uniqueness: {scope: :tag, message: "User tag already exists"}
end
