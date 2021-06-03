class CreateTalents < ActiveRecord::Migration[6.1]
  def change
    create_table :talents do |t|
      t.string :username, null: false
      t.string :wallet_id, null: false
      t.string :description
      t.string :public_key

      t.timestamps
    end

    add_index :talents, :username, unique: true
    add_index :talents, :public_key, unique: true
  end
end
