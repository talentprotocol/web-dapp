class Chat < ApplicationRecord
  encrypts :last_message_text

  # User who initiated the conversation
  belongs_to :sender, class_name: "User"
  # User that received the first message
  belongs_to :receiver, class_name: "User"

  has_many :messages

  validates :sender_id, :receiver_id, :last_message_at, presence: true
  validates :sender_id, uniqueness: {scope: :receiver_id}

  def self.between(sender, receiver)
    Chat.where(
      "(sender_id = :sender_id AND receiver_id = :receiver_id) OR (sender_id = :receiver_id AND receiver_id = :sender_id)",
      sender_id: sender.id,
      receiver_id: receiver.id
    ).take
  end
end
