class AddPartnershipsToDiscoveryRows < ActiveRecord::Migration[6.1]
  def change
    add_reference :discovery_rows, :partnership, foreign_key: true
    remove_column :discovery_rows, :logo_data, :text
  end
end
