class ApplicationController < ActionController::Base
  include Clearance::Controller
  include Pagy::Backend

  layout "application"

  rescue_from ActiveRecord::RecordNotFound, with: :render_404

  def render_404
    render "errors/404", status: :not_found
  end

  def route_not_found
    if Rails.env.development?
      raise ActionController::RoutingError.new("We didn't find any routes that match your request.")
    else
      redirect_to root_path
    end
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
        talents.joins(:token).order(market_cap: :desc)
      elsif sort_params[:sort] == "activity"
        talents.order(activity_count: :desc)
      else
        talents.order(created_at: :desc)
      end
    else
      talents.order(created_at: :desc)
    end
  end

  def talent_filter(talents)
    if filter_params[:filter].present?
      talents.joins(:user)
        .joins("LEFT OUTER JOIN tags ON (tags.talent_id = talent.id AND tags.primary = true)")
        .where(
          "users.username ilike ? OR users.display_name ilike ? OR tags.description ilike ?",
          "%#{filter_params[:filter]}%",
          "%#{filter_params[:filter]}%",
          "%#{filter_params[:filter]}%"
        )
    else
      talents
    end
  end

  def filter_params
    params.permit(:filter)
  end

  def sort_params
    params.permit(:sort)
  end
end
