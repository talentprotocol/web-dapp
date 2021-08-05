class AddDeployedToCoin < ActiveRecord::Migration[6.1]
  def change
    add_column :coins, :deployed, :boolean, default: false
  end
end
