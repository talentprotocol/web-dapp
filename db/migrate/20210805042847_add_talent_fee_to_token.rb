class AddTalentFeeToToken < ActiveRecord::Migration[6.1]
  def change
    add_column :tokens, :talent_fee, :bigint
  end
end
