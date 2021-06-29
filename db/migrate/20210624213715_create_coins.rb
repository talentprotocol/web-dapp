class CreateCoins < ActiveRecord::Migration[6.1]
  def change
    create_table :coins do |t|
      t.integer :price
      t.integer :market_cap
      t.string :ticker

      t.timestamps
    end

    add_reference :coins, :talent, foreign_key: true
    add_index :coins, :ticker
  end
end
