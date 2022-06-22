class TokenAcquiredMailer < ApplicationMailer
  def new_supporter
    record = params[:record]
    @staking_user = User.find(record.params["source_id"])
    @user = params[:recipient]
    @notification = record.to_notification
    record.mark_as_emailed

    subject = "You have a new supporter in Talent Protocol!"

    bootstrap_mail(to: @user.email, subject: subject)
  end

  def existing_supporter
    record = params[:record]
    @staking_user = User.find(record.params["source_id"])
    @user = params[:recipient]
    @notification = record.to_notification
    record.mark_as_emailed

    subject = "Someone really believes in you - You have a new investment by #{@staking_user.display_name}"

    bootstrap_mail(to: @user.email, subject: subject)
  end
end
