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

      quest3 = Quests::Talent.find_or_create_by!(user: user)

      Tasks::LaunchToken.find_or_create_by!(quest: quest3)
      Tasks::PublicProfile.find_or_create_by!(quest: quest3)
      Tasks::ShareProfile.find_or_create_by!(quest: quest3)

      # ---------------------------------------------------

      quest4 = Quests::Scout.find_or_create_by!(user: user)

      Tasks::Register.find_or_create_by!(quest: quest4)
    end
  end
end
