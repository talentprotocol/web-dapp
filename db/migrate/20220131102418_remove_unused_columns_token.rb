class RemoveUnusedColumnsToken < ActiveRecord::Migration[6.1]
  def change
    remove_column :tokens, :price
    remove_column :tokens, :market_cap
    remove_column :tokens, :reserve_ratio
    remove_column :tokens, :talent_fee
  end
end
