# frozen_string_literal: true

module Tasks
  class Watchlist < Task
    def title
      "Add 3 talents to watchlist"
    end

    def description
      "Use the watchlist to save your favourite talents"
    end

    def reward
      "Unlimited user invites"
    end

    def link
      "/talent"
    end
  end
end
