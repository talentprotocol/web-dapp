class AddWelcomePopupToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :welcome_pop_up, :boolean, default: false
  end
end
