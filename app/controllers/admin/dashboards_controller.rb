class Admin::DashboardsController < ApplicationController
  def show
    @user_count = User.all.count
    @invites_count = Invite.all.count
    @badge_count = Badge.all.count
  end
end
