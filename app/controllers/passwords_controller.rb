class PasswordsController < Clearance::PasswordsController
  layout "sessions_layout"

  def create
    if user = find_user_for_create
      user.forgot_password!

      UserMailer.with(user: user).send_password_reset_email.deliver_later
    end

    render template: "passwords/create"
  end
end
