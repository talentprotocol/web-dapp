class AddEmailReminderTimesToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :token_launch_reminder_sent_at, :datetime
    add_column :users, :token_purchase_reminder_sent_at, :datetime
  end
end
