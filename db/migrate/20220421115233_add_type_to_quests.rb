class AddTypeToQuests < ActiveRecord::Migration[6.1]
  def change
    add_column :quests, :type, :string
  end
end
