# frozen_string_literal: true

module Tasks
  class Highlights < Task
    def title
      "Highlights"
    end

    def link
      "/u/#{quest.user.username}/edit_profile?tab=Highlights"
    end
  end
end
