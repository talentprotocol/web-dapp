class DropTransactionsTable < ActiveRecord::Migration[6.1]
  def change
    drop_table :transactions
  end
end
