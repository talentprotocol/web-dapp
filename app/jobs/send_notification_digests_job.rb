class SendNotificationDigestsJob < ApplicationJob
  queue_as :default

  def perform
    notifications = Notification.where(read_at: nil, emailed_at: nil)
      .where("created_at >= ?", 2.day.ago)
      .pluck(:recipient_id, :id).group_by(&:first)
      .transform_values { |pairs| pairs.map(&:second) }

    notifications.each do |user_id, notification_ids|
      NotificationMailer.digest(user_id, notification_ids).deliver_later
    end
  end
end
