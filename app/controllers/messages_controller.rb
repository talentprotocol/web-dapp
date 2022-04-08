class MessagesController < ApplicationController
  before_action :set_receiver, only: [:show, :create]
  before_action :set_user, only: [:index]

  def index
    user_ids = Message.where(sender_id: current_user.id).pluck(:receiver_id)
    user_ids << Message.where(receiver_id: current_user.id).pluck(:sender_id)

    if @user
      user_ids << @user.id
    end
    @users = User.where(id: user_ids.flatten).includes([talent: :token])
    @unread_messages_counts = current_user.messagee.unread.where(sender: @users)
      .group(:sender).count
  end

  def show
    # required for frontend show
    @sender = current_user

    sent = Message.where(sender_id: current_user.id, receiver_id: @receiver.id)
    received = Message.where(sender_id: @receiver.id, receiver_id: current_user.id)
    @messages = sent.or(received).order(:created_at)
    received.update_all(is_read: true)

    @chat_id = current_user.sender_chat_id(@receiver)

    render json: {
      messages: @messages.map(&:to_json),
      chat_id: @chat_id,
      current_user_id: @sender.id,
      lastOnline: @receiver.updated_at,
      profilePictureUrl: @receiver.talent&.profile_picture_url || @receiver.investor&.profile_picture_url,
      username: @receiver.username
    }
  end

  def create
    if message_params[:message].blank? || current_user.id == @receiver.id
      return render json: {
        error: "Unable to create message, either the message is empty or the sender is the same as the receiver."
      }, status: :bad_request
    end

    if @receiver.messaging_disabled?
      return render json: {
        error: "Unable to create a message, the receiver has messaging disabled."
      }, status: :bad_request
    end

    service = Messages::Send.new
    message = service.call(
      sender: current_user,
      receiver: @receiver,
      message: message_params[:message]
    )

    render json: message.to_json
  end

  def send_to_all_supporters
    if message_params[:message].blank?
      return render json: {
        error: "Unable to create message, the message is empty."
      }, status: :bad_request
    end

    job = SendMessageToAllSupportersJob.perform_later(current_user.id, message_params[:message])

    render json: {job_id: job.provider_job_id}
  end

  def send_to_all_supporters_status
    if job_id.blank?
      return render json: {
        error: "Unable to check the status. Missing job id"
      }, status: :bad_request
    end

    render json: {
      messages_sent: Sidekiq::Status.at(job_id),
      messages_total: Sidekiq::Status.total(job_id),
      last_receiver_id: Sidekiq::Status.get(job_id, :last_receiver_id)
    }
  end

  private

  def set_receiver
    @receiver = User.find(params[:id])
  end

  def message_params
    params.permit(:message)
  end

  def set_user
    if params[:user]
      @user = User.find_by(id: params[:user])
    end
  end

  def job_id
    @job_id ||= params[:job_id]
  end
end
