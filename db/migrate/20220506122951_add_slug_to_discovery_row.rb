class AddSlugToDiscoveryRow < ActiveRecord::Migration[6.1]
  def change
    add_column :discovery_rows, :slug, :string, unique: true
  end
end
