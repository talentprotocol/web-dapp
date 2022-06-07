class AddHideProfileToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :hide_profile, :boolean, default: false, null: false
  end
end
