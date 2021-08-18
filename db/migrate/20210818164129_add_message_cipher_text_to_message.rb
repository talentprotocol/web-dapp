class AddMessageCipherTextToMessage < ActiveRecord::Migration[6.1]
  def change
    remove_column :messages, :text
    add_column :messages, :text_ciphertext, :text
  end
end
