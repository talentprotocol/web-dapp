module Quests
  class PopulateForUser
    def call(user:)
      populate_quests_for_user(user: user)

      user.quests
    end

    private

    def populate_quests_for_user(user:)
      quest1 = Quest.create(
        title: "User",
        subtitle: "First quest for new users",
        description: "Fill in your about section and connect your wallet to receive rewards",
        user: user
      )

      Task.create(
        title: "Fill in About",
        description: "To receive CELO you'll need to connect your wallet first",
        reward: "0.01 CELO",
        quest: quest1,
        link: "/u/#{user.username}/edit_profile?tab=About"
      )
      Task.create(
        title: "Connect wallet",
        description: "Connect your wallet in the top menu",
        reward: "User NFT",
        quest: quest1
      )

      # ---------------------------------------------------

      quest2 = Quest.create(
        title: "Supporter",
        subtitle: "First quest for new supporters",
        description: "Add 3 talent to watchlist and buy a talent token",
        user: user
      )
      Task.create(
        title: "Add 3 talent to watchlist",
        description: "Use the watchlist to save your favourite talents",
        reward: "Unlimited supporter invites",
        quest: quest2,
        link: "/talent"
      )
      Task.create(
        title: "Buy a Talent Token",
        description: "Buy at least one talent token of someone you believe in",
        reward: "Member NFT",
        quest: quest2,
        link: "/talent"
      )

      # ---------------------------------------------------

      quest3 = Quest.create(
        title: "Talent",
        subtitle: "First quest for new talents",
        description: "Complete and share your profile",
        user: user
      )
      Task.create(
        title: "Complete Profile and set it public",
        description: "After completing your profile you can set it public so everyone can see it",
        reward: "Unlimited supporter invites",
        quest: quest3,
        link: user.talent ? "/u/#{user.username}/edit_profile?tab=About" : "https://talentprotocol.typeform.com/application"
      )
      Task.create(
        title: "Get your profile out there",
        description: "Get your profile seen by 10 different people",
        reward: "Talent invites (1 invite + 1 invite when that talent launches their token)",
        quest: quest3,
        link: "/u/#{user.username}"
      )
      Task.create(
        title: "Launch your token",
        description: "Launch your token so people can start investing in you",
        reward: "2000 talent tokens",
        quest: quest3,
        link: user.talent ? "/u/#{user.username}/edit_profile?tab=Token" : "https://talentprotocol.typeform.com/application"
      )

      # ---------------------------------------------------

      quest4 = Quest.create(
        title: "Scout",
        subtitle: "First quest for new scouts",
        description: "Get 5 people to register using your personal invite code",
        user: user
      )
      Task.create(
        title: "Get 5 people to register",
        description: "Use your personal invite code so people can register",
        reward: "50 TAL",
        quest: quest4,
        link: "/u/#{user.username}/edit_profile?tab=Invites"
      )
    end
  end
end
