class UserMailer < ApplicationMailer
  def send_sign_up_email
    @user_id = params[:user_id]
    @user = User.find(@user_id)

    bootstrap_mail(to: @user.email, subject: "Welcome to Talent Protocol")
  end

  def send_password_reset_email
    @user = params[:user]
    bootstrap_mail(to: @user.email, subject: "Talent Protocol - Did you forget your password?")
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
    bootstrap_mail(to: @user.email, subject: "Congrats, your Talent Token is now live!")
  end

  def send_token_purchase_reminder_email
    @user = params[:user]
    bootstrap_mail(to: @user.email, subject: "You’re missing out on $TAL rewards!")
  end

  def send_talent_upgrade_email
    @user = params[:user]
    bootstrap_mail(to: @user.email, subject: "Hey, you can now launch your token 🚀")
  end

  def send_message_received_email
    @user = params[:recipient]
    @sender = User.find(params[:sender_id])
    @notification = params[:record].to_notification
    @notification.record.mark_as_emailed

    # we need to check if the user has unread messages
    should_sent = @user.has_unread_messages?

    bootstrap_mail(to: @user.email, subject: "You've got a new message") if should_sent
  end

  def send_complete_profile_reminder_email
    user = params[:user]
    bootstrap_mail(to: user.email, subject: "Complete your profile and launch your token today 🚀")
  end
end
