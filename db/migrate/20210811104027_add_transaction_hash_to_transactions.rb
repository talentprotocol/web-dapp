class AddTransactionHashToTransactions < ActiveRecord::Migration[6.1]
  def change
    add_column :transactions, :transaction_hash, :string

    add_index :transactions, :transaction_hash
  end
end
