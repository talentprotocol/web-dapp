class AddBannerToInvestors < ActiveRecord::Migration[6.1]
  def change
    add_column :investors, :banner_data, :text
  end
end
