class AddChainDetailsToToken < ActiveRecord::Migration[6.1]
  def change
    add_column :tokens, :chain_id, :integer
    add_index :tokens, :chain_id
  end
end
