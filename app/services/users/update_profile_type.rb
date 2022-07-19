module Users
  class UpdateProfileType
    def call(user_id:, new_profile_type:, who_dunnit_id: nil)
      user = User.find(user_id)
      previous_profile_type = user.profile_type

      user.update!(profile_type: new_profile_type)
      UserMailer.with(user: user).send_talent_upgrade_email.deliver_later(wait: 5.seconds) if new_profile_type == "approved"

      UserProfileTypeChange.create!(
        user_id: user_id,
        who_dunnit_id: who_dunnit_id || user_id,
        previous_profile_type: previous_profile_type,
        new_profile_type: new_profile_type
      )
    end
  end
end
