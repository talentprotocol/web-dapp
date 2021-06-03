class CreateInvestors < ActiveRecord::Migration[6.1]
  def change
    create_table :investors do |t|
      t.string :username, null: false
      t.string :wallet_id, null: false
      t.string :description
      t.string :public_key

      t.timestamps
    end

    add_index :investors, :username, unique: true
    add_index :investors, :public_key, unique: true
  end
end
