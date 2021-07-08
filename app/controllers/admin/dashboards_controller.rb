class Admin::DashboardsController < ApplicationController
  def show
    @investor_count = Investor.all.count
    @talent_count = Talent.all.count
    @wait_list_count = WaitList.all.count
  end
end
