class CreateTransactions < ActiveRecord::Migration[6.1]
  def change
    create_table :transactions do |t|
      t.integer :amount
      t.string :status
      t.timestamps
    end

    add_reference :transactions, :token, foreign_key: true
    add_reference :transactions, :investor, foreign_key: true
  end
end
