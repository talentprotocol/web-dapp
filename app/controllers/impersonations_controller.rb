class ImpersonationsController < ApplicationController
  def show
    if current_user.admin?
      user_to_impersonate = User.find_by(username: params[:username])
      if user_to_impersonate
        Impersonation.create!(impersonated: user_to_impersonate, impersonator: current_user, ip: request.remote_ip)
        set_impersonated_user(user_to_impersonate)
        redirect_to user_path(user_to_impersonate.username)
      else
        redirect_to user_root_path, flash: {error: "User to impersonate not found."}
      end
    else
      redirect_to user_root_path, flash: {error: "Unauthorized."}
    end
  end

  def destroy
    if is_user_impersonated?
      cookies.delete :impersonated
      redirect_to user_root_path
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
