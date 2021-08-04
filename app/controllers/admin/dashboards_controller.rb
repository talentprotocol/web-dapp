class Admin::DashboardsController < ApplicationController
  def show
    @user_count = User.all.count
    @wait_list_count = WaitList.all.count
  end
end
