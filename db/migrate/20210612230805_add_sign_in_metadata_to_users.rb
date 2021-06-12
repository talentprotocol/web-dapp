class AddSignInMetadataToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :sign_in_count, :integer, default: 0
    add_column :users, :last_sign_in_at, :datetime
  end
end
