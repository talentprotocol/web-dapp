class AddTitleToGoals < ActiveRecord::Migration[6.1]
  def change
    add_column :goals, :title, :string
  end
end
