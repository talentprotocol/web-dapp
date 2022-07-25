class UserProfileTypeChange < ApplicationRecord
  belongs_to :user, class_name: "User", foreign_key: "user_id"
  belongs_to :who_dunnit, class_name: "User", foreign_key: "who_dunnit_id"

  validate :invalid_new_profile_type

  private

  def invalid_new_profile_type
    return if previous_profile_type != new_profile_type

    errors.add(:base, "The new profile type can't be the same as the previous profile type")
  end
end
