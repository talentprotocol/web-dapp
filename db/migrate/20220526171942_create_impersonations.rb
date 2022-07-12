class CreateImpersonations < ActiveRecord::Migration[6.1]
  def change
    create_table :impersonations do |t|
      t.references :impersonator, foreign_key: { to_table: :users }, index: true
      t.references :impersonated, foreign_key: { to_table: :users }, index: true
      t.text :ip_ciphertext, null: false
      t.string :ip_bidx, index: true

      t.timestamps
    end
  end
end
