class UserMailer < ApplicationMailer
  def send_sign_up_email
    @user = params[:user]
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
end
