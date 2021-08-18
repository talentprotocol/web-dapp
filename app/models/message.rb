class Message < ApplicationRecord
  encrypts :text

  belongs_to :sender, class_name: "User"
  belongs_to :receiver, class_name: "User"

  def sender_chat_id
    [sender_id, receiver_id].join("")
  end

  def receiver_chat_id
    [receiver_id, sender_id].join("")
  end
end
