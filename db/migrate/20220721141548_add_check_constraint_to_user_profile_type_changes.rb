class AddCheckConstraintToUserProfileTypeChanges < ActiveRecord::Migration[6.1]
  def change
    add_check_constraint :user_profile_type_changes,
      "previous_profile_type <> new_profile_type",
      name: "profile_types_check_constraint"
  end
end
