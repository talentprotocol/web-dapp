class Task < ApplicationRecord
  belongs_to :quest

  enum status: {pending: "pending", doing: "doing", claim_rewards: "claim_rewards", done: "done"}
end
