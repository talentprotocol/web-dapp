class CreateCareerGoals < ActiveRecord::Migration[6.1]
  def change
    create_table :career_goals do |t|
      t.text :description
      t.references :talent, null: false, foreign_key: true, unique: true
      t.date :target_date

      t.timestamps
    end
  end
end
