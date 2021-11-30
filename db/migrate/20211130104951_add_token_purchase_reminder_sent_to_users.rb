class AddTokenPurchaseReminderSentToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :token_purchase_reminder_sent, :boolean, default: false
  end
end
