class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.string :status, default: "pending"
      t.string :type
      t.references :quest, foreign_key: true, index: true

      t.timestamps
    end
  end
end
