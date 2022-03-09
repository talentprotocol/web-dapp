class AddBadgeToDiscoveryRow < ActiveRecord::Migration[6.1]
  def change
    add_column :discovery_rows, :badge, :string
  end
end
