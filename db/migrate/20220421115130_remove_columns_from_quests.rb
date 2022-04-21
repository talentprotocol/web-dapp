class RemoveColumnsFromQuests < ActiveRecord::Migration[6.1]
  def change
    remove_column :quests, :title
    remove_column :quests, :subtitle
    remove_column :quests, :description
  end
end
