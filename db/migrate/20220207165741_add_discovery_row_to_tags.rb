class AddDiscoveryRowToTags < ActiveRecord::Migration[6.1]
  def change
    add_reference :tags, :discovery_row, foreign_key: true
  end
end
