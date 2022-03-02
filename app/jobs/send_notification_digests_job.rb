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
      NotificationMailer.digest(row.recipient_id, row.notification_ids).deliver_later
    end
  end
end
