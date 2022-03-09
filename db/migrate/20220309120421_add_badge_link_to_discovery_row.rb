class AddBadgeLinkToDiscoveryRow < ActiveRecord::Migration[6.1]
  def change
    add_column :discovery_rows, :badge_link, :string
  end
end
