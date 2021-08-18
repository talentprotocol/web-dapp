class AddProfilePictureDataToInvestor < ActiveRecord::Migration[6.1]
  def change
    add_column :investors, :profile_picture_data, :text
  end
end
