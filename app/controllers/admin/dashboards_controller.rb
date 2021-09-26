class Admin::DashboardsController < ApplicationController
  def show
    @user_count = User.all.count
    @wait_list_count = WaitList.all.count
    @badge_count = Badge.all.count
  end
end
