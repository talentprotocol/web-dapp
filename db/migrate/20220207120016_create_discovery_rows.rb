class CreateDiscoveryRows < ActiveRecord::Migration[6.1]
  def change
    create_table :discovery_rows do |t|
      t.string :title, null: false

      t.timestamps
    end
  end
end
