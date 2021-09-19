class CreateNotification
  def initialize
  end

  def call(body:, user_id:, type:, source_id: nil)
    return if Notification.where(user_id: user_id, type: type, read: false, source_id: source_id).count.positive?

    Notification.create!(body: body, user_id: user_id, type: type, source_id: source_id)
  end
end
