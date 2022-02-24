class AddHiddenToTags < ActiveRecord::Migration[6.1]
  def change
    add_column :tags, :hidden, :boolean, default: false
  end
end
