class Message < ApplicationRecord
  encrypts :text

  # TODO make it mandatory after running migrations
  belongs_to :chat, optional: true

  belongs_to :sender, class_name: "User"
  belongs_to :receiver, class_name: "User"

  scope :unread, -> { where(is_read: false) }

  def sender_chat_id
    [sender_id, receiver_id].join("")
  end

  def receiver_chat_id
    [receiver_id, sender_id].join("")
  end

  def to_json
    {
      id: id,
      sender_id: sender_id,
      receiver_id: receiver_id,
      created_at: created_at,
      updated_at: updated_at,
      text: text
    }
  end
end
