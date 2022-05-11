class RemoveColumnsFromQuests < ActiveRecord::Migration[6.1]
  def up
    remove_column :quests, :title
    remove_column :quests, :subtitle
    remove_column :quests, :description
  end

  def down
    add_column :quests, :title, :string
    add_column :quests, :subtitle, :string
    add_column :quests, :description, :string
  end
end
