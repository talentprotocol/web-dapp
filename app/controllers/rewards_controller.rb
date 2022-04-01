class RewardsController < ApplicationController
  def index
    @talent_invites = current_user.invites.where(talent_invite: true)
    @supporter_invites = current_user.invites.where(talent_invite: false)
  end
end
