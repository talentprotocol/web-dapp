class AddIndexToDescription < ActiveRecord::Migration[6.1]
  def change
    add_index :tags, :description
  end
end
