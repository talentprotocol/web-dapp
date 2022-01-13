class SessionsController < Clearance::SessionsController
  def create
    @user = authenticate(params)

    if @user&.disabled?
      alert = "Your account has been disabled, reach out to us if you think this is a mistake."
      render json: {error: alert}, status: :unauthorized
    else
      sign_in(@user) do |status|
        if status.success?
          render json: {}, status: :ok
        else
          render json: {error: status.failure_message}, status: :unauthorized
        end
      end
    end
  end
end
