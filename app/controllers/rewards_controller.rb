class RewardsController < ApplicationController
  def index
    invites = current_user.invites
    @talent_invites = invites.select { |i| i.talent_invite }
    @supporter_invites = invites.select { |i| !i.talent_invite }

    @races_count = Race.count
    @user_rewards = current_user.rewards
    race_registered_users = User.where.not(race_id: nil)
    @race_registered_users_count = race_registered_users.count
    @users_that_bought_tokens_count = race_registered_users.where(tokens_purchased: true).count
    race_rewards = Reward.race.order(amount: :desc).includes(:user)
    @race_rewards = RewardBlueprint.render_as_json(race_rewards, view: :normal)

    if @talent_invites.length > 0
      invite_ids = @talent_invites.map(&:id)
      talents = Talent.joins(:user).where(user: {invite_id: invite_ids})

      @talent_list = TalentBlueprint.render_as_json(talents, view: :short_meta, current_user_watchlist: current_user_watchlist)
    end

    quests = Quest.where(user: current_user).order(:id)
    @quests = QuestBlueprint.render_as_json(quests.includes(:user, :tasks), view: :normal)
  end
end
