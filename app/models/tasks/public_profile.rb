# frozen_string_literal: true

module Tasks
  class PublicProfile < Task
    def title
      "Publish your profile"
    end

    def link
      quest.user.talent ? "/u/#{quest.user.username}/edit_profile?tab=About" : "https://talentprotocol.typeform.com/application"
    end
  end
end
