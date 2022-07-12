class AddLastAccessAtToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :last_access_at, :datetime
  end
end
