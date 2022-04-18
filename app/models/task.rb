class Task < ApplicationRecord
  belongs_to :quest

  enum status: {pending: "pending", doing: "doing", claim_rewards: "claim_rewards", done: "done"}
  enum title: {
    "Fill in About": "Fill in About",
    "Connect wallet": "Connect wallet",
    "Add 3 talent to watchlist": "Add 3 talent to watchlist",
    "Buy a Talent Token": "Buy a Talent Token",
    "Complete Profile and set it public": "Complete Profile and set it public",
    "Get your profile out there": "Get your profile out there",
    "Launch your token": "Launch your token",
    "Get 5 people to register": "Get 5 people to register"
  }
end
