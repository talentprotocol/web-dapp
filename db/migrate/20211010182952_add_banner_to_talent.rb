class AddBannerToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :banner_data, :text
  end
end
