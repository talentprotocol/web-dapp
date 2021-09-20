class AddExtraFieldsToCareerGoal < ActiveRecord::Migration[6.1]
  def change
    add_column :career_goals, :bio, :string
    add_column :career_goals, :pitch, :string
    add_column :career_goals, :challenges, :string
  end
end
