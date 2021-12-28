class SessionsController < Clearance::SessionsController
  def create
    @user = authenticate(params)

    if @user&.disabled?
      flash.now.alert = "Your account has been disabled, reach out to us if you think this is a mistake."
      render template: "sessions/new", status: :unauthorized
    else
      sign_in(@user) do |status|
        if status.success?
          redirect_back_or url_after_create
        else
          flash.now.alert = status.failure_message
          render template: "sessions/new", status: :unauthorized
        end
      end
    end
  end
end
