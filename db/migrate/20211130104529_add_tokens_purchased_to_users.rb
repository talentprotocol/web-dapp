class AddTokensPurchasedToUsers < ActiveRecord::Migration[6.1]
  def up
    add_column :users, :tokens_purchased, :boolean, default: false

    User.update_all(tokens_purchased: true)
  end

  def down
    remove_column :users, :tokens_purchased, :boolean, default: false
  end
end
