class AddReserveRatioToCoin < ActiveRecord::Migration[6.1]
  def change
    add_column :coins, :reserve_ratio, :integer
  end
end
