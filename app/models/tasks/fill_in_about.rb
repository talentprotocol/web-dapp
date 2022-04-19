module Tasks
  class FillInAbout < Task
    def title
      "Fill in About"
    end

    def description
      "To receive CELO you'll need to connect your wallet first"
    end

    def reward
      "0.01 CELO"
    end

    def link
      "/u/#{quest.user.username}/edit_profile?tab=About"
    end
  end
end
