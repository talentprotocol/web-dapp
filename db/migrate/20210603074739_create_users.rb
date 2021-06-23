class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :username, null: false
      t.string :email
      t.string :encrypted_password, limit: 128
      t.string :remember_token, limit: 128, null: false
      t.string :role, null: false

      t.timestamps
    end

    add_index :users, :username, unique: true
    add_index :users, :email, unique: true
    add_index :users, :remember_token
  end
end
