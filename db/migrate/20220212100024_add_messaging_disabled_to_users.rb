class AddMessagingDisabledToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :messaging_disabled, :boolean, default: false
  end
end
