class AddFieldsToDiscoveryRows < ActiveRecord::Migration[6.1]
  def change
    add_column :discovery_rows, :slug, :string, unique: true
    add_column :discovery_rows, :description, :text
    add_column :discovery_rows, :logo_data, :text
  end
end
