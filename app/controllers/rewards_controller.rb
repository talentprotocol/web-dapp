class RewardsController < ApplicationController
  def index
    invites = current_user.invites
    @talent_invites = invites.select { |i| i.talent_invite }
    @supporter_invites = invites.select { |i| !i.talent_invite }

    @race = Race.active_race || Race.last
    # we only want to show the current & previous race
    @races = Race.last(2)
    @rewards = current_user.rewards

    if @talent_invites.length > 0
      invite_ids = @talent_invites.map(&:id)
      talents = Talent.joins(:user).where(user: {invite_id: invite_ids})

      @talent_list = TalentBlueprint.render_as_json(talents, view: :short_meta, current_user: current_user)
    end

    service = PrepareRaceResults.new(race: @race, user: current_user)
    @race_results = service.call

    quests = Quest.where(user: current_user).order(:id)

    @quests = QuestBlueprint.render_as_json(quests.includes(:user, :tasks), view: :normal)
  end
end
