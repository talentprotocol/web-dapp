class Chat < ApplicationRecord
  # User who initiated the conversation
  belongs_to :sender, class_name: "User"
  # User that received the first message
  belongs_to :receiver, class_name: "User"

  validates :sender_id, :receiver_id, :last_message_at, presence: true
  validates :sender_id, uniqueness: {scope: :receiver_id}
end
