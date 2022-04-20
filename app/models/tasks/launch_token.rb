module Tasks
  class LaunchToken < Task
    def title
      "Launch your token"
    end

    def description
      "Launch your token so people can start investing in you"
    end

    def reward
      "2000 talent tokens"
    end

    def link
      quest.user.talent ? "/u/#{quest.user.username}/edit_profile?tab=Token" : "https://talentprotocol.typeform.com/application"
    end
  end
end
