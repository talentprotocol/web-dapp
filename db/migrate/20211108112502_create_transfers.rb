class CreateTransfers < ActiveRecord::Migration[6.1]
  def change
    create_table :transfers do |t|
      t.bigint :amount
      t.string :tx_hash
      t.timestamps
    end

    add_reference :transfers, :user, foreign_key: true, unique: true
  end
end
