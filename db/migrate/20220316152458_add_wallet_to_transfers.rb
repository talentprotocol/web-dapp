class AddWalletToTransfers < ActiveRecord::Migration[6.1]
  def change
    add_column :transfers, :wallet_id, :string
    add_index :transfers, :wallet_id
  end
end
