module Tasks
  class PopulateForUser
    def call(user:)
      populate_quests_and_tasks_for_user(user: user)

      user.quests
    end

    private

    def populate_quests_and_tasks_for_user(user:)
      quest1 = Quests::User.find_or_create_by!(user: user)

      Tasks::FillInAbout.find_or_create_by!(quest: quest1)
      Tasks::ConnectWallet.find_or_create_by!(quest: quest1)

      # ---------------------------------------------------

      quest2 = Quests::Supporter.find_or_create_by!(user: user)

      Tasks::Watchlist.find_or_create_by!(quest: quest2)
      Tasks::BuyTalentToken.find_or_create_by!(quest: quest2)

      # ---------------------------------------------------

      quest3 = Quests::TalentProfile.find_or_create_by!(user: user)

      Tasks::Highlights.find_or_create_by!(quest: quest3)
      Tasks::Goals.find_or_create_by!(quest: quest3)

      # ---------------------------------------------------

      quest4 = Quests::TalentToken.find_or_create_by!(user: user)

      Tasks::ApplyTokenLaunch.find_or_create_by!(quest: quest4)

      service = Tasks::Update.new
      service.call(type: "Tasks::ApplyTokenLaunch", user: user) unless user.profile_type == "supporter"

      Tasks::LaunchToken.find_or_create_by!(quest: quest4)
      Tasks::Perks.find_or_create_by!(quest: quest4)

      # ---------------------------------------------------

      quest5 = Quests::Ambassador.find_or_create_by!(user: user)

      Tasks::Register.find_or_create_by!(quest: quest5)

      # ---------------------------------------------------

      quest6 = Quests::Scout.find_or_create_by!(user: user)

      Tasks::InviteTokenLaunch.find_or_create_by!(quest: quest6)
    end
  end
end
