module CreateNotification
  def self.call(recipient:, type:, source_id: nil)
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

  def self.get_existing_unread(recipient:, type:, source_id:)
    notifications = Notification.where(type: type.name, recipient: recipient,
                                       read_at: nil)
    if source_id
      notifications = notifications.where("(params->>'source_id')::bigint = ?",
        source_id.to_int)
    end
    notifications.last
  end
  private_class_method :get_existing_unread
end
