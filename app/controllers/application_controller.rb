class ApplicationController < ActionController::Base
  include Clearance::Controller
  include Pagy::Backend

  layout "application"

  rescue_from ActiveRecord::RecordNotFound, with: :render_404

  def render_404
    render "errors/404", status: :not_found
  end

  private

  def id_param
    Integer(params[:id])
  rescue
    0
  end

  def talent_id_param
    Integer(params[:talent_id])
  rescue
    0
  end

  def talent_sort(talents)
    if sort_params[:sort].present?
      if sort_params[:sort] == "market_cap"
        talents.joins(:coin).order(market_cap: :desc)
      elsif sort_params[:sort] == "activity"
        talents.order(activity_count: :desc)
      else
        talents.order(created_at: :desc)
      end
    else
      talents.order(created_at: :desc)
    end
  end

  def sort_params
    params.permit(:sort)
  end
end
