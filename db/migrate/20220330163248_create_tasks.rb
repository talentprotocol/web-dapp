class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.string :title
      t.string :description
      t.string :reward
      t.string :status, default: "pending"
      t.string :link
      t.references :quest, foreign_key: true

      t.timestamps
    end
  end
end
