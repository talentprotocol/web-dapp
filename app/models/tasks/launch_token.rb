# frozen_string_literal: true

module Tasks
  class LaunchToken < Task
    def title
      "Launch your token"
    end

    def link
      quest.user.talent ? "/u/#{quest.user.username}/edit_profile?tab=Token" : "https://talentprotocol.typeform.com/application"
    end
  end
end
