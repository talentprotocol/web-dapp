class CreateNotification
  def call(recipient:, type:, source_id: nil, model_id: nil)
    notification = get_existing_unread(
      recipient: recipient,
      type: type,
      source_id: source_id,
      model_id: model_id
    )
    if notification.present?
      notification.updated_at = Time.current
      notification.save!
    else
      params = {}
      params["source_id"] = source_id if source_id.present?
      params["model_id"] = model_id if model_id.present?
      params = params.stringify_keys
      notification = type.with(params)
      notification.deliver_later(recipient)
    end
  end

  private

  def get_existing_unread(recipient:, type:, source_id:, model_id:)
    notifications = Notification.where(type: type.name, recipient: recipient, read_at: nil)

    if source_id && model_id
      notifications = notifications.find_by_source_and_model_id(source_id, model_id)
    elsif source_id
      notifications = notifications.find_by_source_id(source_id)
    end
    notifications.last
  end
end
