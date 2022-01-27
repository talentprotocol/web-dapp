class API::V1::NotificationsController < ApplicationController
  before_action :set_notification, only: [:update]

  def update
    result = @notification.update(notification_params)

    if result
      render json: {success: "Notification successfully updated."}, status: :ok
    else
      render json: {error: "Unable to update notification."}, status: :unprocessable_entity
    end
  end

  private

  def set_notification
    @notification = Notification.find(params[:id])
  end

  def notification_params
    params.require(:notification).permit(:read)
  end
end
