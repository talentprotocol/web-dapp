class PasswordsController < Clearance::PasswordsController
  def create
    if (user = find_user_for_create)
      user.forgot_password!

      UserMailer.with(user: user).send_password_reset_email.deliver_later
    end

    render json: {}, status: :ok
  end

  def update
    @user = find_user_for_update

    if @user.update_password(password_from_password_reset_params)
      session[:password_reset_token] = nil

      render json: {id: @user.id}, status: :ok
    else
      render json: {error: "There was an error changing the password"}, status: :unauthorized
    end
  end
end
