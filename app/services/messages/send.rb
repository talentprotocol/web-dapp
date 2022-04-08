module Messages
  class Send
    def call(sender:, receiver:, message:, sent_to_supporters: false)
      return if sender.id == receiver.id

      message = create_message(sender, receiver, message, sent_to_supporters)
      create_notification_for(receiver)
      broadcast(message)

      message
    end

    private

    attr_reader :sender, :receiver, :message

    def create_message(sender, receiver, message, sent_to_supporters)
      Message.create!(sender: sender, receiver: receiver, text: message, sent_to_supporters: sent_to_supporters)
    end

    def create_notification_for(receiver)
      CreateNotification.new.call(
        recipient: receiver,
        type: MessageReceivedNotification
      )
    end

    def create_notification_service
      @create_notification_service ||= CreateNotification.new
    end

    def broadcast(message)
      ActionCable.server.broadcast("message_channel_#{message.receiver_chat_id}", message: message.to_json)
    end
  end
end
