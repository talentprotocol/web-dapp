module Tasks
  class PopulateForUser
    def call(user:)
      populate_quests_and_tasks_for_user(user: user)

      user.quests
    end

    private

    def populate_quests_and_tasks_for_user(user:)
      beginner_quest = Quests::User.find_or_create_by!(user: user)

      Tasks::FillInAbout.find_or_create_by!(quest: beginner_quest)
      Tasks::ConnectWallet.find_or_create_by!(quest: beginner_quest)

      # ---------------------------------------------------

      new_supporter_quest = Quests::Supporter.find_or_create_by!(user: user)

      Tasks::Watchlist.find_or_create_by!(quest: new_supporter_quest)
      Tasks::BuyTalentToken.find_or_create_by!(quest: new_supporter_quest)

      # ---------------------------------------------------

      complete_profile_quest = Quests::TalentProfile.find_or_create_by!(user: user)

      Tasks::Highlights.find_or_create_by!(quest: complete_profile_quest)
      Tasks::Goals.find_or_create_by!(quest: complete_profile_quest)

      # ---------------------------------------------------

      launch_token_quest = Quests::TalentToken.find_or_create_by!(user: user)

      Tasks::ApplyTokenLaunch.find_or_create_by!(quest: launch_token_quest)

      service = Tasks::Update.new
      service.call(type: "Tasks::ApplyTokenLaunch", user: user) unless user.profile_type == "supporter"

      Tasks::LaunchToken.find_or_create_by!(quest: launch_token_quest)
      Tasks::Perks.find_or_create_by!(quest: launch_token_quest)

      # ---------------------------------------------------

      ambassador_quest = Quests::Ambassador.find_or_create_by!(user: user)

      Tasks::Register.find_or_create_by!(quest: ambassador_quest)

      # ---------------------------------------------------

      scout_quest = Quests::Scout.find_or_create_by!(user: user)

      Tasks::InviteTokenLaunch.find_or_create_by!(quest: scout_quest)

      # ---------------------------------------------------

      verify_profile_quest = Quests::VerifiedProfile.find_or_create_by!(user: user)

      Tasks::Verified.find_or_create_by!(quest: verify_profile_quest)
    end
  end
end
