class UserMailer < ApplicationMailer
  def send_sign_up_email
    @user_id = indifferent_access_params[:user_id]
    @user = User.find(@user_id)

    bootstrap_mail(to: @user.email, subject: "Welcome to Talent Protocol")
  end

  def send_password_reset_email
    @user = indifferent_access_params[:user]
    bootstrap_mail(to: @user.email, subject: "Talent Protocol - Did you forget your password?")
  end

  def send_invite_email
    @invite = indifferent_access_params[:invite]
    @email = indifferent_access_params[:email]
    bootstrap_mail(to: @email, subject: "Talent Protocol - You're in!")
  end

  def send_welcome_email
    @user = indifferent_access_params[:user]
    bootstrap_mail(to: @user.email, subject: @user.talent? ? "Invite to launch your token on Talent Protocol 🔑" : "Personal invite for Talent Protocol Beta 🔑")
  end

  def send_token_launch_reminder_email
    @user = indifferent_access_params[:user]
    bootstrap_mail(to: @user.email, subject: "Ready to launch your Talent Token? 🚀")
  end

  def send_token_launched_email
    @user = indifferent_access_params[:user]
    bootstrap_mail(to: @user.email, subject: "Congrats, your Talent Token is now live!")
  end

  def send_token_purchase_reminder_email
    @user = indifferent_access_params[:user]
    bootstrap_mail(to: @user.email, subject: "You're missing out on TAL rewards 💸")
  end

  def send_message_received_email
    @user = indifferent_access_params[:recipient]
    @sender = User.find(indifferent_access_params[:sender_id])
    @notification = indifferent_access_params[:record].to_notification
    @notification.record.mark_as_emailed

    # we need to check if the user has unread messages
    should_sent = @user.has_unread_messages?

    bootstrap_mail(to: @user.email, subject: "You've got a new message") if should_sent
  end

  def send_complete_profile_reminder_email
    user = indifferent_access_params[:user]
    bootstrap_mail(to: user.email, subject: "Complete your profile and launch your token today 🚀")
  end

  private

  def indifferent_access_params
    @indifferent_access_params ||= params.with_indifferent_access
  end
end
