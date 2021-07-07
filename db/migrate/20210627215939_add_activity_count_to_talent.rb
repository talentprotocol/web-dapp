class AddActivityCountToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :activity_count, :integer, default: 0
    add_index :talent, :activity_count
  end
end
