class SendNotificationDigestsJob < ApplicationJob
  queue_as :default

  def perform
    notifications = Notification
      .where(read_at: nil, emailed_at: nil)
      .where("created_at >= ?", 2.days.ago)
      .group(:recipient_id)
      .select(
        "recipient_id",
        'array_agg("id") as notification_ids'
      )

    notifications.each do |row|
      # We should make sure the user hasn't in the mean time read the messages
      # but forgot about the notification
      notifications = Notification.where(id: row.notification_ids)
      digest_notification_ids = []
      if notifications.where(type: "MessageReceivedNotification").exists?
        user = User.find_by(user_id: row.recipient_id)
        digest_notification_ids =
          if user.has_unread_messages?
            row.notification_ids
          else
            notifications.where(type: "MessageReceivedNotification").update_all(read_at: Time.current)
            notifications.where.not(type: "MessageReceivedNotification").pluck(:id)
          end
      end
      NotificationMailer.digest(row.recipient_id, digest_notification_ids).deliver_later
    end
  end
end
