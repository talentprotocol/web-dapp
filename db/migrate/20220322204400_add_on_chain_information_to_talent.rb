class AddOnChainInformationToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :supporters_count, :int
    add_column :talent, :total_supply, :string
  end
end
