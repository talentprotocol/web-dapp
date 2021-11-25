class AddTokenLaunchReminderToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :token_launch_reminder_sent, :boolean, default: false
  end
end
