class AddIsVerifiedToTalent < ActiveRecord::Migration[6.1]
  def change
    add_column :talent, :is_verified, :boolean, default: false
  end
end
