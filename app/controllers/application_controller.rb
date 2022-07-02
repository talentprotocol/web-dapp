class ApplicationController < ActionController::Base
  include Clearance::Controller
  include Pagy::Backend

  before_action :track_user_activity
  before_action :set_paper_trail_whodunnit

  layout "application"

  protect_from_forgery

  rescue_from ActiveRecord::RecordNotFound, with: :render_404

  helper_method :is_user_impersonated?, :current_acting_user, :current_impersonated_user

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

  def current_impersonated_user
    @current_impersonated_user ||= user_from_impersonated_cookie
    @current_impersonated_user
  end

  def is_user_impersonated?
    current_impersonated_user.present?
  end

  def current_acting_user
    is_user_impersonated? ? current_impersonated_user : current_user
  end

  protected

  def prevent_user_impersonation
    redirect_to user_root_path, flash: {error: "Unauthorized."} if is_user_impersonated?
  end

  private

  def track_user_activity
    # safe navigation is required for non-auth users (sign_up, login)
    current_user&.touch
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
    current_acting_user ? current_acting_user.following.pluck(:user_id) : []
  end

  def user_from_impersonated_cookie
    User.find_by(username: cookies.signed[:impersonated])
  end
end
