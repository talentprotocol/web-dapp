class TokenAcquiredMailer < ApplicationMailer
  def new_supporter
    record = params[:record]
    @staking_user = User.find(record.params["source_id"])
    @user = params[:recipient]
    @notification = record.to_notification
    record.mark_as_emailed

    set_profile_picture_attachment(@staking_user)

    subject = "You have a new supporter in Talent Protocol!"

    bootstrap_mail(to: @user.email, subject: subject)
  end

  def existing_supporter
    record = params[:record]
    @staking_user = User.find(record.params["source_id"])
    @user = params[:recipient]
    @notification = record.to_notification
    record.mark_as_emailed

    set_profile_picture_attachment(@staking_user)

    subject = "Someone really believes in you - You have a new investment by #{@staking_user.display_name}"

    bootstrap_mail(to: @user.email, subject: subject)
  end

  private

  def set_profile_picture_attachment(user)
    return unless user.profile_picture_url

    attachments.inline["profile_picture.png"] = Down.download(user.profile_picture_url).read
  rescue => e
    Rollbar.error(e, "Error downloading picture of user_id: ##{user.id}")
  end
end
