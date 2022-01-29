module Messages
  class Send
    def call(sender:, receiver:, message:)
      return if sender.id == receiver.id

      message = create_message(sender, receiver, message)
      create_notification_for(receiver)
      broadcast(message)

      message
    end

    private

    attr_reader :sender, :receiver, :message

    def create_message(sender, receiver, message)
      Message.create!(sender: sender, receiver: receiver, text: message)
    end

    def create_notification_for(receiver)
      create_notification_service.call(
        title: "New message",
        body: "You have a new message",
        user_id: receiver.id,
        type: "Notifications::MessageReceived"
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
