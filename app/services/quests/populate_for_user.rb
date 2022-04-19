module Quests
  class PopulateForUser
    def call(user:)
      populate_quests_for_user(user: user)

      user.quests
    end

    private

    def populate_quests_for_user(user:)
      quest1 = Quest.find_or_create_by!(
        title: "User",
        subtitle: "First quest for new users",
        description: "Fill in your about section and connect your wallet to receive rewards",
        user: user
      )

      Tasks::FillInAbout.find_or_create_by!(quest: quest1)
      Tasks::ConnectWallet.find_or_create_by!(quest: quest1)

      # ---------------------------------------------------

      quest2 = Quest.find_or_create_by!(
        title: "Supporter",
        subtitle: "First quest for new supporters",
        description: "Add 3 talent to watchlist and buy a talent token",
        user: user
      )

      Tasks::Watchlist.find_or_create_by!(quest: quest2)
      Tasks::BuyTalentToken.find_or_create_by!(quest: quest2)

      # ---------------------------------------------------

      quest3 = Quest.find_or_create_by!(
        title: "Talent",
        subtitle: "First quest for new talents",
        description: "Complete and share your profile",
        user: user
      )

      Tasks::PublicProfile.find_or_create_by!(quest: quest3)
      Tasks::ShareProfile.find_or_create_by!(quest: quest3)
      Tasks::LaunchToken.find_or_create_by!(quest: quest3)

      # ---------------------------------------------------

      quest4 = Quest.find_or_create_by!(
        title: "Scout",
        subtitle: "First quest for new scouts",
        description: "Get 5 people to register using your personal invite code",
        user: user
      )

      Tasks::Register.find_or_create_by!(quest: quest4)
    end
  end
end
