class CreateRewards < ActiveRecord::Migration[6.1]
  def change
    create_table :rewards do |t|
      t.references :user, null: false, foreign_key: true
      t.string :reason
      t.string :category
      t.integer :amount

      t.timestamps
    end
  end
end
