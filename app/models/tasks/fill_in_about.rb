module Tasks
  class FillInAbout < Task
    def title
      "Profile: About"
    end

    def description
      "Add information to your profile to be eligible to receive 0.01 CELO when you connect your wallet"
    end

    def reward
      "0.01 CELO"
    end

    def link
      "/u/#{quest.user.username}/edit_profile?tab=About"
    end
  end
end
