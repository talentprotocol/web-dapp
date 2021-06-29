class CreateTalent < ActiveRecord::Migration[6.1]
  def change
    create_table :talent do |t|
      t.string :username, null: false
      t.string :wallet_id, null: false
      t.string :description
      t.string :public_key

      t.timestamps
    end

    add_index :talent, :username, unique: true
    add_index :talent, :public_key, unique: true
  end
end
