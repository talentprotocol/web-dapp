module Tasks
  class PublicProfile < Task
    def title
      "Complete Profile and set it public"
    end

    def description
      "After completing your profile you can set it public so everyone can see it"
    end

    def reward
      "Unlimited supporter invites"
    end

    def link
      quest.user.talent ? "/u/#{quest.user.username}/edit_profile?tab=About" : "https://talentprotocol.typeform.com/application"
    end
  end
end
