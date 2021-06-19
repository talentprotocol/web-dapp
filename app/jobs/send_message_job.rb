class SendMessageJob < ApplicationJob
  queue_as :default

  def perform(message_id, created_at)
    message = Message.find(message_id)

    unless message.created_at.to_s == created_at
      ActionCable.server.broadcast("message_channel_#{message.receiver_chat_id}", message: message)
    end
  end
end
