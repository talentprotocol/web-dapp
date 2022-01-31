class Admin::DashboardsController < ApplicationController
  def show
    @user_count = User.all.count
  end
end
