class AddProfilePictureDataToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :profile_picture_data, :text
  end
end
