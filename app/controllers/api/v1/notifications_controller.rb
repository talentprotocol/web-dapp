class API::V1::NotificationsController < ApplicationController
  before_action :check_user_impersonation

  def mark_all_as_read
    current_user.notifications.where(read_at: nil).update_all(read_at: Time.current)

    render json: {success: "Notifications were marked as read"}, status: :ok
  end

  def mark_as_read
    id = params[:notification_id]

    notification = current_user.notifications.find(id)
    notification.mark_as_read! if notification.read_at.nil?

    render json: {success: "Notification successfully updated."},
           status: :ok
  end
end
