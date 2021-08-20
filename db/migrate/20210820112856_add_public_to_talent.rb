class AddPublicToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :public, :boolean, default: false
  end
end
