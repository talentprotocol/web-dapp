class AddInboundToTransactions < ActiveRecord::Migration[6.1]
  def change
    add_column :transactions, :inbound, :boolean
  end
end
