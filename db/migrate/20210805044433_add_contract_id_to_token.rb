class AddContractIdToToken < ActiveRecord::Migration[6.1]
  def change
    add_column :tokens, :contract_id, :string
  end
end
