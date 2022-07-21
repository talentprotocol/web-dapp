class AddDigestEmailSentAtToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :digest_email_sent_at, :datetime
  end
end
