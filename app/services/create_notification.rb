class CreateNotification
  def call(recipient:, type:, source_id: nil, model_id: nil, extra_params: {})
    notification = get_existing_unread(
      recipient: recipient,
      type: type,
      source_id: source_id,
      model_id: model_id
    )

    if notification.present? && notification.unread_for_more_than_a_week?
      send(notification.to_notification, recipient)

      notification.mark_as_read!
    elsif notification.present?
      notification.update!(updated_at: Time.current)
    else
      notification = type.with(notification_params(source_id, model_id, extra_params))
      send(notification, recipient)
    end
  end

  private

  def notification_params(source_id, model_id, extra_params)
    params = {}.merge(extra_params)
    params["source_id"] = source_id if source_id.present?
    params["model_id"] = model_id if model_id.present?
    params.stringify_keys
  end

  def get_existing_unread(recipient:, type:, source_id:, model_id:)
    notifications = Notification.where(type: type.name, recipient: recipient, read_at: nil)

    if source_id && model_id
      notifications = notifications.find_by_source_and_model_id(source_id, model_id)
    elsif source_id
      notifications = notifications.find_by_source_id(source_id)
    end
    notifications.last
  end

  def send(notification, recipient)
    notification.deliver_later(recipient)
  end
end
