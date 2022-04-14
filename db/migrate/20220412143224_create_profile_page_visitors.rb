class CreateProfilePageVisitors < ActiveRecord::Migration[6.1]
  def change
    create_table :profile_page_visitors do |t|
      t.text :ip_ciphertext, null: false
      t.string :ip_bidx, index: true
      t.references :user, null: false, foreign_key: true, index: true

      t.timestamps
    end
  end
end
