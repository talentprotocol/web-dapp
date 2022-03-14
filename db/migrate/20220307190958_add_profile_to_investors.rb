class AddProfileToInvestors < ActiveRecord::Migration[6.1]
  def change
    add_column :investors, :profile, :jsonb, default: {}
  end
end
