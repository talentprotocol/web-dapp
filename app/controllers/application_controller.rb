class ApplicationController < ActionController::Base
  include Clearance::Controller
  include Pagy::Backend

  layout "application"

  private

  def talent_sort(talents)
    if params[:sort].present?
      if params[:sort] == "market_cap"
        talents.joins(:coin).order(market_cap: :desc)
      elsif params[:sort] == "activity"
        talents.order(activity_count: :desc)
      else
        talents.order(created_at: :desc)
      end
    else
      talents
    end
  end
end
