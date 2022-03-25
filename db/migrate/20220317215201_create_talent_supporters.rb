class CreateTalentSupporters < ActiveRecord::Migration[6.1]
  def change
    create_table :talent_supporters do |t|
      t.string :amount
      t.string :tal_amount
      t.string :supporter_wallet_id, null: false
      t.string :talent_contract_id, null: false
      t.datetime :synced_at, null: false

      t.timestamps
    end

    add_index :talent_supporters, [:supporter_wallet_id, :talent_contract_id], unique: true, name: :talent_supporters_wallet_token_contract_uidx
  end
end
