class CreateImpersonations < ActiveRecord::Migration[6.1]
  def change
    create_table :impersonations do |t|
      t.integer :impersonator_id, null: false
      t.integer :impersonated_id, null: false
      t.text :ip_ciphertext, null: false
      t.string :ip_bidx, index: true

      t.timestamps
    end
  end
end
