module Messages
  class SendToAllSupporters
    class Error < StandardError; end

    class UserWithoutSupporters < Error; end

    def initialize(user:, message:)
      @user = user
      @message = message
    end

    def call
      raise UserWithoutSupporters, "You need to have supporters to use this functionality." unless investors.any?

      investors.map do |investor|
        receiver = investor.user

        message = send_message_to(receiver)
        create_notification_for(receiver)
        broadcast(message)

        message
      end
    end

    private

    attr_reader :user, :message

    def investors
      return [] unless user.talent

      user.talent.investors.distinct.includes(:user)
    end

    def send_message_to(receiver)
      Message.create!(sender: user, receiver: receiver, text: message)
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
