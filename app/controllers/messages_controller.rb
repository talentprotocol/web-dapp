class MessagesController < ApplicationController
  before_action :set_receiver, only: [:show, :create]
  def index
    @users = User.where.not(id: current_user.id)
  end

  def show
    @sender = current_user
    @messages = Message.where(sender_id: current_user.id, receiver_id: @receiver.id)
      .or(Message.where(sender_id: @receiver.id, receiver_id: current_user.id))

    @chat_id = current_user.sender_chat_id(@receiver)
  end

  def create
    message = Message.create(sender: current_user, receiver: @receiver, text: params[:message])

    ActionCable.server.broadcast("message_channel_#{message.receiver_chat_id}", message: message)
    # SendMessageJob.perform_later(message.id, message.created_at.to_s)

    render json: message
  end

  private

  def set_receiver
    @receiver = User.find(params[:id])
  end
end
