class MessagesController < ApplicationController
  before_action :set_receiver, only: [:show, :create]
  before_action :set_user, only: [:index]

  def index
    user_ids = Message.where(sender_id: current_user.id).pluck(:receiver_id)
    user_ids << Message.where(receiver_id: current_user.id).pluck(:sender_id)

    if @user
      user_ids << @user.id
    end
    @users = User.where(id: user_ids).includes([talent: :token])
  end

  def show
    # required for frontend show
    @sender = current_user

    @messages = Message.where(sender_id: current_user.id, receiver_id: @receiver.id)
      .or(Message.where(sender_id: @receiver.id, receiver_id: current_user.id))

    @chat_id = current_user.sender_chat_id(@receiver)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: {messages: @messages.map(&:to_json), chat_id: @chat_id, current_user_id: @sender.id, profilePictureUrl: @receiver.talent&.profile_picture_url} }
    end
  end

  def create
    message = Message.create(sender: current_user, receiver: @receiver, text: message_params[:message])

    ActionCable.server.broadcast("message_channel_#{message.receiver_chat_id}", message: message)
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
