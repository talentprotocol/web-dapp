class CreateGoals < ActiveRecord::Migration[6.1]
  def change
    create_table :goals do |t|
      t.date :due_date, null: false
      t.string :description
      t.timestamps
    end

    add_reference :goals, :career_goal, foreign_key: true
  end
end
