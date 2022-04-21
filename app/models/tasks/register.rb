module Tasks
  class Register < Task
    def title
      "Invite 5 friends"
    end

    def link
      "/u/#{quest.user.username}/edit_profile?tab=Invites"
    end
  end
end
