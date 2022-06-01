class ImpersonationsController < ApplicationController

    def show
        if current_user.admin?
            user_to_impersonate = User.find_by(username: params[:username])
            if user_to_impersonate
                current_impersonation = Impersonation.where(impersonated: current_acting_user, impersonator: current_user, ended_at: nil).first

                if current_impersonation.present?
                    redirect_to user_root_path, flash: {error: "Unauthorized."} 
                else
                    Impersonation.create!(impersonated: user_to_impersonate, impersonator: current_user, ip: request.remote_ip)
                    set_impersonated_user(user_to_impersonate)
                    redirect_to user_path(user_to_impersonate.username)
                end
            else
                redirect_to user_root_path, flash: {error: "Unauthorized."} 
            end
        else
            redirect_to user_root_path, flash: {error: "Unauthorized."} 
        end
    end

    def end_session
        if current_acting_user && current_user.admin?
            current_impersonation = Impersonation.where(impersonated: current_acting_user, impersonator: current_user, ended_at: nil).first
            if current_impersonation.present?
                current_impersonation.update!(ended_at: DateTime.now)
                redirect_to user_root_path
            else
                redirect_to user_root_path, flash: {error: "Impersonation not found."} 
            end
        else
            redirect_to user_root_path, flash: {error: "Unauthorized."} 
        end
    end

end
