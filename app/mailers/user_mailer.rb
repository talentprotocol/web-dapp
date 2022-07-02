class UserMailer < ApplicationMailer
  def send_sign_up_email
    @user_id = params[:user_id]
    @user = User.find(@user_id)

    bootstrap_mail(to: @user.email, subject: "Welcome to Talent Protocol")
  end

  def send_password_reset_email
    @user = params[:user]
    bootstrap_mail(to: @user.email, subject: "Talent Protocol - Password reset")
  end

  def send_invite_email
    @invite = params[:invite]
    @email = params[:email]
    bootstrap_mail(to: @email, subject: "Talent Protocol - You're in!")
  end

  def send_welcome_email
    @user = params[:user]
    bootstrap_mail(to: @user.email, subject: "Welcome to Talent Protocol")
  end

  def send_token_launch_reminder_email
    @user = params[:user]
    bootstrap_mail(to: @user.email, subject: "All set - It’s time to launch your token!")
  end

  def send_token_launched_email
    @user = params[:user]
    @invite = @user.invite
    bootstrap_mail(to: @user.email, subject: "Your Talent Token is live! 💫")
  end

  def send_token_purchase_reminder_email
    @user = params[:user]
    bootstrap_mail(to: @user.email, subject: "You’re missing out on $TAL rewards!")
  end

  def send_talent_upgrade_email
    @user = params[:user]
    bootstrap_mail(to: @user.email, subject: "Hey, you can now launch your token 🚀")
  end
end
