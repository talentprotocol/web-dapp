class ConsolidateWalletIds < ActiveRecord::Migration[6.1]
  def change
    remove_index :users, :external_id
    remove_column :users, :external_id

    remove_column :talent, :wallet_id
    remove_column :investors, :wallet_id

    add_column :users, :wallet_id, :string
    add_index :users, :wallet_id, unique: true
  end
end
