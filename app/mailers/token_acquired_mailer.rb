class TokenAcquiredMailer < ApplicationMailer
  def new_supporter
    record = params[:record]
    @staking_user = User.find(record.params["source_id"])
    @user = params[:recipient]
    @notification = record.to_notification
    record.mark_as_emailed

    subject = "Talent Protocol - #{@notification.title}"

    # if the record type is not MessageReceivedNotification then always end
    # but if the record type is MessageReceivedNotification we need to check
    # if the user has unread messages
    should_sent = params[:record].type != "MessageReceivedNotification" || @user.has_unread_messages?

    bootstrap_mail(to: @user.email, subject: subject) if should_sent
  end

  def existing_supporter
    @staking_user = User.find(params["source_id"])
    @user = params[:recipient]
    @notification = params[:record].to_notification
    @notification.record.mark_as_emailed

    subject = "Someone really believes in you - You have a new investment by #{@staking_user.display_name}"

      subject = "Talent Protocol - Here's what you missed"
      bootstrap_mail(to: @user.email, subject: subject)
    end
  end
end
