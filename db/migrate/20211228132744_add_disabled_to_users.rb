class AddDisabledToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :disabled, :boolean, default: false
  end
end
