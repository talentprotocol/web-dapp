class CreateQuests < ActiveRecord::Migration[6.1]
  def change
    create_table :quests do |t|
      t.string :title
      t.string :subtitle
      t.string :description
      t.string :status, default: "pending"
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
