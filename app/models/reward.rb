class Reward < ApplicationRecord
  belongs_to :user
  validate :category_is_valid

  CATEGORIES = ["QUEST", "RACE", "TALENT_INVITE", "OTHER"]

  private

  def category_is_valid
    return if CATEGORIES.include?(category)

    errors.add(:base, "The category isn't supported.")
  end
end
