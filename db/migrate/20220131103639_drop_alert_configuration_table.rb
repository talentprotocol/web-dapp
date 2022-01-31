class DropAlertConfigurationTable < ActiveRecord::Migration[6.1]
  def change
    drop_table :alert_configurations
  end
end
