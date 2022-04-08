class AddSentToSupportersToMessage < ActiveRecord::Migration[6.1]
  def change
    add_column :messages, :sent_to_supporters, :boolean, default: false
  end
end
