class RemoveTalentIdFromTags < ActiveRecord::Migration[6.1]
  def change
    remove_column :tags, :talent_id
  end
end
