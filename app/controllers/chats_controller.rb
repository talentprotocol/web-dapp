class ChatsController < ApplicationController
  PER_PAGE = 20

  def index
    chats = Chat.of_user(current_user)

    if user
      user_chat = Chat.between(current_user, user)
      chats = chats.or(Chat.where(id: user_chat.id))
    end

    @pagy, chats = pagy(chats.includes(:sender, :receiver).order(last_message_at: :desc), items: per_page)
    @chats = ChatBlueprint.render_as_json(chats, view: :normal, current_user: current_user)
  end

  private

  def user
    @user ||= User.find_by(id: params[:user])
  end

  def per_page
    params[:per_page] || PER_PAGE
  end
end
