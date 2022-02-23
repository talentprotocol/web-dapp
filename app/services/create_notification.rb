class CreateNotification
  def call(recipient:, type:, source_id: nil)
    notification = get_existing_unread(recipient: recipient,
                                       type: type,
                                       source_id: source_id)
    if notification.present?
      notification.updated_at = Time.current
      notification.save!
    else
      params = source_id.present? ? {"source_id" => source_id} : {}
      notification = type.with(params)
      notification.deliver_later(recipient)
    end
  end

  private

  def get_existing_unread(recipient:, type:, source_id:)
    notifications = Notification.where(type: type.name, recipient: recipient,
                                       read_at: nil)
    if source_id
      notifications = notifications.find_by_source_id(source_id)
    end
    notifications.last
  end
end
