class AddUniqueToTokenTicker < ActiveRecord::Migration[6.1]
  def change
    remove_index :tokens, :ticker
    add_index :tokens, :ticker, unique: true
  end
end
