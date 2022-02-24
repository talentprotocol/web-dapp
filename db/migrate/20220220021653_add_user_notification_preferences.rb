class AddUserNotificationPreferences < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :notification_preferences, :jsonb, default: {}
    add_column :notifications, :emailed_at, :datetime
  end
end
