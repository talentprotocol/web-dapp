# frozen_string_literal: true

module Tasks
  class LaunchToken < Task
    def title
      "Launch your token"
    end

    def link
      quest.user.talent ? "/u/#{quest.user.username}/edit_profile?tab=Token" : nil
    end
  end
end
