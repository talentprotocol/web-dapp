module Tasks
  class ShareProfile < Task
    def title
      "Get your profile out there"
    end

    def link
      "/u/#{quest.user.username}"
    end
  end
end
