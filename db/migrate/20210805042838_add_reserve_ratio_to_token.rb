class AddReserveRatioToToken < ActiveRecord::Migration[6.1]
  def change
    add_column :tokens, :reserve_ratio, :integer
  end
end
