class AddTagLinkToDiscoveryRow < ActiveRecord::Migration[6.1]
  def change
    add_column :discovery_rows, :tag_link, :string
  end
end
