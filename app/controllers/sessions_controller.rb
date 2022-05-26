class SessionsController < Clearance::SessionsController
  protect_from_forgery

  def create
    email = params[:session][:email]

    if User.find_by(email: email&.downcase)
      @user = authenticate(params)

      if @user&.disabled?
        alert = "Your account has been disabled, reach out to us if you think this is a mistake."
        render json: {error: alert}, status: :unauthorized
      else
        sign_in(@user) do |status|
          if status.success?
            render json: {}, status: :ok
          else
            render json: {error: "wrong email or password"}, status: :unauthorized
          end
        end
      end
    else
      render json: {error: "wrong email or password"}, status: :unauthorized
    end
  end
end
