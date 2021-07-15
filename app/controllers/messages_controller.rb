class MessagesController < ApplicationController
  before_action :set_receiver, only: [:show, :create]

  def index
    user_ids = Message.where(sender_id: current_user.id).pluck(:receiver_id)
    user_ids << Message.where(receiver_id: current_user.id).pluck(:sender_id)

    @users = User.where(id: user_ids)
  end

  def show
    # required for frontend show
    @sender = current_user

    @messages = Message.where(sender_id: current_user.id, receiver_id: @receiver.id)
      .or(Message.where(sender_id: @receiver.id, receiver_id: current_user.id))

    @chat_id = current_user.sender_chat_id(@receiver)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: {messages: @messages, chat_id: @chat_id, current_user_id: @sender.id} }
    end
  end

  def create
    message = Message.create(sender: current_user, receiver: @receiver, text: message_params[:message])

    ActionCable.server.broadcast("message_channel_#{message.receiver_chat_id}", message: message)
    # SendMessageJob.perform_later(message.id, message.created_at.to_s)

    render json: message
  end

  private

  def set_receiver
    @receiver = User.find(params[:id])
  end

  def message_params
    params.permit(:message)
  end
end
