module Users
  class UpdateProfileType
    def call(user_id:, new_profile_type:, who_dunnit_id: nil)
      user = User.find(user_id)
      previous_profile_type = user.profile_type

      user.update!(profile_type: new_profile_type)
      UserProfileTypeChange.create!(
        user_id: user_id,
        who_dunnit_id: who_dunnit_id || user_id,
        previous_profile_type: previous_profile_type,
        new_profile_type: new_profile_type
      )
    end
  end
end
