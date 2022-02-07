class RemovePrimaryFromTags < ActiveRecord::Migration[6.1]
  def change
    remove_column :tags, :primary
  end
end
