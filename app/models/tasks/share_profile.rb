module Tasks
  class ShareProfile < Task
    def title
      "Get your profile out there"
    end

    def description
      "Get your profile seen by 10 different people"
    end

    def reward
      "Talent invites (1 invite + 1 invite when that talent launches their token)"
    end

    def link
      "/u/#{quest.user.username}"
    end
  end
end
