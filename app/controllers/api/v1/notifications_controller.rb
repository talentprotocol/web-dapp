class API::V1::NotificationsController < ApplicationController
  def mark_as_read
    id = params[:notification_id]
    notification = current_user.notifications.find(id)
    notification.mark_as_read! if notification.read_at.nil?
    render json: {success: "Notification successfully updated."},
           status: :ok
  end
end
