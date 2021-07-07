class CreateRewards < ActiveRecord::Migration[6.1]
  def change
    create_table :rewards do |t|
      t.integer :required_amount
      t.text :description
      t.references :talent, null: false, foreign_key: true

      t.timestamps
    end
  end
end
