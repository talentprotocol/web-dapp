class Reward < ApplicationRecord
  belongs_to :user

  enum category: {quest: "quest", race: "race", talent_invite: "talent_invite", other: "other"}
end
