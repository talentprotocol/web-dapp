class CreateTokens < ActiveRecord::Migration[6.1]
  def change
    create_table :tokens do |t|
      t.integer :price
      t.integer :market_cap
      t.string :ticker

      t.timestamps
    end

    add_reference :tokens, :talent, foreign_key: true
    add_index :tokens, :ticker
  end
end
