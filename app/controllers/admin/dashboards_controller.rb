class Admin::DashboardsController < ApplicationController
  def show
    @investor_count = Investor.all.count
    @talent_count = Talent.all.count
  end
end
