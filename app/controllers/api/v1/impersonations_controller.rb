class API::V1::ImpersonationsController < ApplicationController
  def create
    if current_user.admin?
      user_to_impersonate = User.find_by(username: params[:username])
      if user_to_impersonate
        Impersonation.create!(impersonated: user_to_impersonate, impersonator: current_user, ip: request.remote_ip)
        set_impersonated_user(user_to_impersonate)
        render json: {success: "Impersonation started successfully"}, status: :created
      else
        render json: {error: "User to impersonate not found."}, status: :not_found
      end
    else
      render json: {error: "Unauthorized."}, status: :unauthorized
    end
  end

  def destroy
    if current_user.admin? && is_user_impersonated?
      cookies.delete :impersonated
      render json: {success: "Impersonation ended successfully"}, status: :ok
    else
      render json: {error: "Unauthorized."}, status: :unauthorized
    end
  end

  private

  def set_impersonated_user user
    cookies.signed[:impersonated] = {
      value: user.username,
      expires: 30.minutes.from_now
    }
  end
end
