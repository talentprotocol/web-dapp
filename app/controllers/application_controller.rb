class ApplicationController < ActionController::Base
  include Clearance::Controller
  include Pagy::Backend

  before_action :track_user_activity

  layout "application"

  protect_from_forgery

  rescue_from ActiveRecord::RecordNotFound, with: :render_404

  def render_404
    render "errors/404", status: :not_found
  end

  def route_not_found
    if Rails.env.development? || Rails.env.test?
      raise ActionController::RoutingError.new("We didn't find any routes that match your request.")
    else
      respond_to do |format|
        format.html { redirect_to root_path }
        format.json {
          render(
            json: {message: "We didn't find any routes that match your request."},
            status: :not_found
          )
        }
      end

    end
  end

  private

  def track_user_activity
    # safe navigation is required for non-auth users (sign_up, login)
    current_user&.update_column(:last_access_at, Time.zone.now)
  end

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

  def current_user_watchlist
    current_user ? current_user.following.pluck(:user_id) : []
  end
end
