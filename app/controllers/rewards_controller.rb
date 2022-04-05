class RewardsController < ApplicationController
  def index
    invites = current_user.invites
    @talent_invites = invites.select { |i| i.talent_invite }
    @supporter_invites = invites.select { |i| !i.talent_invite }

    @race = Race.active_race || Race.last
    @rewards = current_user.rewards

    service = PrepareRaceResults.new(race: @race, user: current_user)
    @race_results = service.call
  end
end
