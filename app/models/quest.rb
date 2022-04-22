class Quest < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :destroy

  validates :user, uniqueness: {scope: :type, message: "Quest for this user already exists"}

  enum status: {pending: "pending", doing: "doing", claim_rewards: "claim_rewards", done: "done"}
end
