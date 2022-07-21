class CreateChats < ActiveRecord::Migration[6.1]
  def change
    create_table :chats do |t|
      t.datetime :last_message_at, null: false

      t.references :sender, foreign_key: {to_table: "users"}, null: false
      t.references :receiver, foreign_key: {to_table: "users"}, null: false

      t.integer :sender_unread_messages_count, default: 0
      t.integer :receiver_unread_messages_count, default: 0

      t.timestamps
    end
    add_column :chats, :last_message_text_ciphertext, :text
    add_index :chats, [:sender_id, :receiver_id], unique: true
  end
end
