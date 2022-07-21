class AddChatToMessages < ActiveRecord::Migration[6.1]
  def change
    add_reference :messages, :chat, foreign_key: true, index: true
  end
end
