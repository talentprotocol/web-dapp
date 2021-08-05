class AddTalentFeeToCoin < ActiveRecord::Migration[6.1]
  def change
    add_column :coins, :talent_fee, :bigint
  end
end
