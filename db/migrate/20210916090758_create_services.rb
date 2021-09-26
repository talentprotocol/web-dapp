class CreateServices < ActiveRecord::Migration[6.1]
  def change
    create_table :services do |t|
      t.integer :price, null: false
      t.string :title, null: false
      t.timestamps
    end

    add_reference :services, :talent, foreign_key: true
  end
end
