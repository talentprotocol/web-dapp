class CreateAlertConfigurations < ActiveRecord::Migration[6.1]
  def change
    create_table :alert_configurations do |t|
      t.string :page, null: false
      t.string :alert_type
      t.string :text
      t.string :href
      t.string :button_text
      t.string :css_class

      t.timestamps
    end

    add_index :alert_configurations, :page, unique: true
  end
end
