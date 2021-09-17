class CreateMilestones < ActiveRecord::Migration[6.1]
  def change
    create_table :milestones do |t|
      t.string :title, null: false
      t.date :start_date, null: false
      t.date :end_date
      t.string :description
      t.string :link
      t.timestamps
    end

    add_reference :milestones, :talent, foreign_key: true
  end
end
