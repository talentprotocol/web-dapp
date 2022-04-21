namespace :chat do
  task create_chats: :environment do
    Message.order(created_at: :desc).find_each do |message|
      chat = Chat.find_by(sender: message.sender, receiver: message.receiver)

      chat ||= Chat.create!(
        sender: message.sender,
        receiver: message.receiver,
        last_message_at: message.created_at,
        last_message_text: message.text
      )

      message.update!(chat: chat)
    end
  end
end
