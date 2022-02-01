class CreateNotification
  def initialize
  end

  def call(title:, body:, user_id:, type:, source_id: nil)
    notification = Notification.where(user_id: user_id, type: type, read: false, source_id: source_id).last
    if notification.present?
      notification.updated_at = Time.current
      notification.save!
    else
      Notification.create!(title: title, body: body, user_id: user_id, type: type, source_id: source_id)
    end
  end
end
