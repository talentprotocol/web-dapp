class AddIsReadToMessages < ActiveRecord::Migration[6.1]
  def change
    add_column :messages, :is_read, :boolean, default: false, null: false
  end
end
