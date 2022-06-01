class ApplicationController < ActionController::Base
  include Clearance::Controller
  include Pagy::Backend

  before_action :track_user_activity

  layout "application"

  protect_from_forgery

  rescue_from ActiveRecord::RecordNotFound, with: :render_404

  helper_method :user_is_impersonated?, :current_acting_user
  
  def render_404
    render "errors/404", status: :not_found
  end

  def route_not_found
    if Rails.env.development? || Rails.env.test?
      raise ActionController::RoutingError.new("We didn't find any routes that match your request.")
    else
      redirect_to root_path
    end
  end
  
  def current_impersonated_user
    @current_impersonated_user ||= user_from_impersonated_cookie
    @current_impersonated_user
  end

  def user_is_impersonated?
    current_impersonated_user.present?
  end

  def current_acting_user
    user_is_impersonated? ? current_impersonated_user : current_user 
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


  def set_impersonated_user user
    cookies.signed[:impersonated] = {
      value: user.username
    }
  end

  def user_from_impersonated_cookie
    User.where(username: cookies.signed[:impersonated]).first
  end

end
