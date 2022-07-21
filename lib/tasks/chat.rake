namespace :chat do
  task create_chats: :environment do
    Message.order(created_at: :desc).find_each do |message|
      chat = Chat.between(message.sender, message.receiver)

      chat ||= Chat.create!(
        sender: message.sender,
        receiver: message.receiver,
        last_message_at: message.created_at,
        last_message_text: message.text
      )

      message.update!(chat: chat)

      unless message.is_read?
        if chat.sender_id == message.sender_id
          chat.receiver_unread_messages_count += 1
        else
          chat.sender_unread_messages_count += 1
        end

        chat.save!
      end
    end
  end
end
