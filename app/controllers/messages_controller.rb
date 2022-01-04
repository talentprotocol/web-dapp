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

    render json: {messages: @messages.map(&:to_json), chat_id: @chat_id, current_user_id: @sender.id, profilePictureUrl: @receiver.talent&.profile_picture_url || @receiver.investor&.profile_picture_url}
  end

  def create
    if message_params[:message].empty? || current_user.id == @receiver.id
      return render json: {
        error: "Unable to create message, either the message is empty or the sender is the same as the receiver."
      }, status: :bad_request
    end

    message = Message.create(sender: current_user, receiver: @receiver, text: message_params[:message])
    service = CreateNotification.new
    service.call(
      title: "New message",
      body: "You have a new message",
      user_id: @receiver.id,
      type: "Notifications::MessageReceived"
    )
    ActionCable.server.broadcast("message_channel_#{message.receiver_chat_id}", message: message.to_json)
    # SendMessageJob.perform_later(message.id, message.created_at.to_s)

    render json: message.to_json
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
end
