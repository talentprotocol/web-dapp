module Tasks
  class Register < Task
    def title
      "Get 5 people to register"
    end

    def description
      "Use your personal invite code so people can register"
    end

    def reward
      "50 TAL"
    end

    def link
      "/u/#{quest.user.username}/edit_profile?tab=Invites"
    end
  end
end
