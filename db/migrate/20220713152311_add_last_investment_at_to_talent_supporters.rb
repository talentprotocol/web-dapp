class AddLastInvestmentAtToTalentSupporters < ActiveRecord::Migration[6.1]
  def change
    add_column :talent_supporters, :last_investment_at, :datetime
  end
end
