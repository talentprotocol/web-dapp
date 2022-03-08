class NotificationMailer < ApplicationMailer
  def immediate
    @user = params[:recipient]
    @notification = params[:record].to_notification
    @notification.record.mark_as_emailed

    subject = "Talent Protocol - #{@notification.title}"

    # if the record type is not MessageReceivedNotification then always end
    # but if the record type is MessageReceivedNotification we need to check
    # if the user has unread messages
    should_sent = params[:record].type != "MessageReceivedNotification" || @user.has_unread_messages?

    bootstrap_mail(to: @user.email, subject: subject) if should_sent
  end

  def digest(user_id, notification_ids)
    @user = User.find(user_id)
    @notifications =
      Notification.unread.unemailed.where(id: notification_ids)
        .order(created_at: :desc).map(&:to_notification)
    @notifications = @notifications.filter do |notification|
      notification.should_deliver_digest_email?
    end

    if @notifications.present?
      Notification.where(id: @notifications.map { |n| n.record.id })
        .update_all(emailed_at: Time.current)

      subject = "Talent Protocol - Here's what you missed"
      bootstrap_mail(to: @user.email, subject: subject)
    end
  end
end
