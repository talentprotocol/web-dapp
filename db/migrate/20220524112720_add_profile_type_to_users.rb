class AddProfileTypeToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :profile_type, :string, default: "supporter", null: false
  end
end
