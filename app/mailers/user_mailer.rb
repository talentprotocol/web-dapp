class UserMailer < ApplicationMailer
  def send_sign_up_email
    @user = params[:user]
    mail(to: @user.email, subject: 'Welcome to Talent Protocol')
  end
end