class AddTagToDiscoveryRow < ActiveRecord::Migration[6.1]
  def change
    add_column :discovery_rows, :tag, :string
  end
end
