class AddContractIdToCoin < ActiveRecord::Migration[6.1]
  def change
    add_column :coins, :contract_id, :string
  end
end
