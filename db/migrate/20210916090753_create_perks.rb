class CreatePerks < ActiveRecord::Migration[6.1]
  def change
    create_table :perks do |t|
      t.integer :price, null: false
      t.string :title, null: false
      t.timestamps
    end

    add_reference :perks, :talent, foreign_key: true
  end
end
