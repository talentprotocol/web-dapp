class AddCompleteProfileReminderSentAtToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :complete_profile_reminder_sent_at, :datetime
  end
end
