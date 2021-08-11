class AddBlockHashToTransactions < ActiveRecord::Migration[6.1]
  def change
    add_column :transactions, :block_hash, :string

    add_index :transactions, :block_hash
  end
end
