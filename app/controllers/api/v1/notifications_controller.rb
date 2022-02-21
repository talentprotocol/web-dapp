class API::V1::NotificationsController < ApplicationController
  def mark_as_read
    id = params[:notification_id]
    notification = current_user&.notifications&.find_by_id(id)

    if notification.present?
      notification.mark_as_read!
      render json: {success: "Notification successfully updated."},
             status: :ok
    else
      render json: {error: "Unable to update notification."},
             status: :unprocessable_entity
    end
  end
end
